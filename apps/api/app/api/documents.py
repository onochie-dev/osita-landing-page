"""
Document API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os
import uuid
import shutil
from pathlib import Path

from ..database import get_db
from ..models.document import Document, DocumentStatus, DocumentLanguage
from ..models.project import Project
from ..models.extraction import Extraction, ExtractedField, FieldStatus, FieldType
from ..schemas.document import DocumentResponse, DocumentUploadResponse, DocumentListResponse
from ..config import get_settings
from ..services.ocr_service import OCRService, MockOCRService
from ..services.extraction_service import ExtractionService, MockExtractionService
from ..services.validation_service import ValidationService

router = APIRouter()
settings = get_settings()


@router.post("/upload/{project_id}", response_model=List[DocumentUploadResponse])
async def upload_documents(
    project_id: str,
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Upload one or more PDF documents to a project.
    Processing happens in the background.
    """
    # Verify project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Create upload directory
    upload_dir = Path(settings.upload_dir) / project_id
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    uploaded = []
    
    for file in files:
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Only PDF files are accepted: {file.filename}"
            )
        
        # Generate unique filename
        doc_id = str(uuid.uuid4())
        safe_filename = f"{doc_id}.pdf"
        file_path = upload_dir / safe_filename
        
        # Save file
        try:
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
            file_size = len(content)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )
        
        # Create document record
        document = Document(
            id=doc_id,
            project_id=project_id,
            filename=safe_filename,
            original_filename=file.filename,
            file_path=str(file_path),
            file_size=file_size,
            status=DocumentStatus.UPLOADED
        )
        
        db.add(document)
        db.commit()
        db.refresh(document)
        
        # Queue background processing
        background_tasks.add_task(process_document, doc_id)
        
        uploaded.append(DocumentUploadResponse(
            id=document.id,
            filename=document.filename,
            original_filename=document.original_filename,
            status=document.status,
            file_size=document.file_size,
            message="Document uploaded, processing started"
        ))
    
    return uploaded


@router.get("/project/{project_id}", response_model=DocumentListResponse)
async def list_project_documents(
    project_id: str,
    db: Session = Depends(get_db)
):
    """List all documents in a project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    documents = db.query(Document).filter(Document.project_id == project_id).all()
    
    return DocumentListResponse(
        documents=[_document_to_response(d) for d in documents],
        total=len(documents)
    )


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    db: Session = Depends(get_db)
):
    """Get a document by ID."""
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    return _document_to_response(document)


@router.get("/{document_id}/pdf")
async def get_document_pdf(
    document_id: str,
    db: Session = Depends(get_db)
):
    """Download the original PDF."""
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    if not os.path.exists(document.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="PDF file not found on disk"
        )
    
    return FileResponse(
        document.file_path,
        media_type="application/pdf",
        filename=document.original_filename
    )


@router.get("/{document_id}/ocr")
async def get_document_ocr(
    document_id: str,
    db: Session = Depends(get_db)
):
    """Get OCR output for a document."""
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    if document.status in [DocumentStatus.UPLOADED, DocumentStatus.OCR_PROCESSING]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="OCR not yet complete"
        )
    
    if document.status == DocumentStatus.OCR_FAILED:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"OCR failed: {document.error_message}"
        )
    
    return document.ocr_raw_output


@router.post("/{document_id}/reprocess", response_model=DocumentResponse)
async def reprocess_document(
    document_id: str,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Reprocess a document (re-run OCR and extraction)."""
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Reset status
    document.status = DocumentStatus.UPLOADED
    document.error_message = None
    db.commit()
    
    # Queue background processing
    background_tasks.add_task(process_document, document_id)
    
    return _document_to_response(document)


@router.put("/{document_id}/language")
async def set_document_language(
    document_id: str,
    language: DocumentLanguage,
    db: Session = Depends(get_db)
):
    """Override detected language for a document."""
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    document.language_override = language
    db.commit()
    
    return {"status": "ok", "language": language}


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    document_id: str,
    db: Session = Depends(get_db)
):
    """Delete a document."""
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    # Delete file
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    db.delete(document)
    db.commit()


async def process_document(document_id: str):
    """
    Background task to process a document.
    Runs OCR and extraction.
    """
    import traceback
    from ..database import get_db_context
    
    print(f"[PROCESS] Starting document processing: {document_id}")
    
    with get_db_context() as db:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            print(f"[PROCESS] Document not found: {document_id}")
            return
        
        # Use mock services if no API keys configured
        if settings.mistral_api_key:
            ocr_service = OCRService()
            print(f"[PROCESS] Using real Mistral OCR")
        else:
            ocr_service = MockOCRService()
            print(f"[PROCESS] Using mock OCR (no Mistral API key)")
        
        if settings.openai_api_key:
            extraction_service = ExtractionService()
            print(f"[PROCESS] Using OpenAI extraction, model: {extraction_service.model}")
            print(f"[PROCESS] Is fine-tuned: {extraction_service.is_finetuned}")
        else:
            extraction_service = MockExtractionService()
            print(f"[PROCESS] Using mock extraction (no OpenAI API key)")
        
        validation_service = ValidationService()
        
        # Step 1: OCR
        document.status = DocumentStatus.OCR_PROCESSING
        db.commit()
        print(f"[PROCESS] Starting OCR...")
        
        try:
            ocr_result = await ocr_service.process_pdf(document.file_path)
            document.page_count = ocr_result.page_count
            document.detected_language = DocumentLanguage(ocr_result.detected_language) if ocr_result.detected_language in ["en", "fr", "ar"] else DocumentLanguage.UNKNOWN
            document.ocr_confidence = ocr_result.confidence
            document.ocr_processing_time = ocr_result.processing_time
            document.ocr_raw_output = ocr_result.to_dict()
            document.status = DocumentStatus.OCR_COMPLETE
            db.commit()
        except Exception as e:
            print(f"[PROCESS] OCR FAILED: {str(e)}")
            traceback.print_exc()
            document.status = DocumentStatus.OCR_FAILED
            document.error_message = str(e)
            db.commit()
            return
        
        print(f"[PROCESS] OCR complete, {ocr_result.page_count} pages")
        
        # Step 2: Extraction
        document.status = DocumentStatus.EXTRACTION_PROCESSING
        db.commit()
        print(f"[PROCESS] Starting extraction...")
        
        try:
            extraction_result = await extraction_service.extract_from_ocr(
                ocr_result, document.id
            )
            print(f"[PROCESS] Extraction complete, {len(extraction_result.fields)} fields")
            
            # Mark old extractions as not current
            db.query(Extraction).filter(
                Extraction.document_id == document_id,
                Extraction.is_current == True
            ).update({"is_current": False})
            
            # Get next version number
            max_version = db.query(Extraction).filter(
                Extraction.document_id == document_id
            ).count()
            
            # Create extraction record
            extraction = Extraction(
                document_id=document_id,
                version=max_version + 1,
                is_current=True,
                model_name=extraction_result.model_name,
                processing_time=extraction_result.processing_time,
                raw_output=extraction_result.raw_response,
                canonical_data=extraction_result.canonical_data
            )
            db.add(extraction)
            db.flush()
            
            # Create field records
            for field_data in extraction_result.fields:
                field = ExtractedField(
                    extraction_id=extraction.id,
                    field_name=field_data["field_name"],
                    field_type=FieldType(field_data["field_type"]) if field_data["field_type"] in [e.value for e in FieldType] else FieldType.OTHER,
                    value=field_data.get("value"),
                    unit=field_data.get("unit"),
                    confidence=field_data.get("confidence"),
                    status=FieldStatus.UNCONFIRMED,
                    source_page=field_data.get("source_page"),
                    source_quote=field_data.get("source_quote")
                )
                db.add(field)
            
            document.status = DocumentStatus.EXTRACTION_COMPLETE
            db.commit()
            
            # Step 3: Validate document
            doc_validation = validation_service.validate_document(
                extraction_result.canonical_data, document_id
            )
            
            # Store validation flags
            from ..models.validation import ValidationFlag as VFModel
            for flag in doc_validation.flags:
                vf = VFModel(
                    document_id=document_id,
                    project_id=document.project_id,
                    code=flag.code,
                    category=flag.category,
                    severity=flag.severity,
                    message=flag.message,
                    suggestion=flag.suggestion,
                    field_name=flag.field_name,
                    expected_value=flag.expected_value,
                    actual_value=flag.actual_value,
                    context=flag.context
                )
                db.add(vf)
            
            # Update project canonical data
            _update_project_canonical(db, document.project_id)
            
            db.commit()
            
        except Exception as e:
            print(f"[PROCESS] EXTRACTION FAILED: {str(e)}")
            traceback.print_exc()
            document.status = DocumentStatus.EXTRACTION_FAILED
            document.error_message = str(e)
            db.commit()
            return
        
        print(f"[PROCESS] Document processing complete!")


def _update_project_canonical(db: Session, project_id: str):
    """Aggregate all document extractions into project canonical data."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return
    
    documents = db.query(Document).filter(
        Document.project_id == project_id,
        Document.status == DocumentStatus.EXTRACTION_COMPLETE
    ).all()
    
    all_bills = []
    total_mwh = 0.0
    
    for doc in documents:
        extraction = db.query(Extraction).filter(
            Extraction.document_id == doc.id,
            Extraction.is_current == True
        ).first()
        
        if extraction and extraction.canonical_data:
            bills = extraction.canonical_data.get("electricity_bills", [])
            all_bills.extend(bills)
            total_mwh += extraction.canonical_data.get("total_electricity_mwh", 0) or 0
    
    # Calculate emissions
    emission_factor = float(project.emission_factor_value or 0.4)  # Default 0.4 tCO2/MWh
    total_emissions = total_mwh * emission_factor
    
    project.canonical_data = {
        "reporting_period": project.reporting_period.value if project.reporting_period else None,
        "reporting_year": project.reporting_year,
        "declarant": project.declarant_info,
        "installation": project.installation_info,
        "electricity_bills": all_bills,
        "total_electricity_mwh": total_mwh,
        "indirect_emissions": [{
            "electricity_consumed_mwh": total_mwh,
            "emission_factor": emission_factor,
            "emission_factor_source": project.emission_factor_source,
            "emissions_tco2": total_emissions
        }] if total_mwh > 0 else [],
        "total_indirect_emissions_tco2": total_emissions,
        "extraction_version": "1.0"
    }


def _document_to_response(document: Document) -> DocumentResponse:
    """Convert document model to response schema."""
    return DocumentResponse(
        id=document.id,
        project_id=document.project_id,
        filename=document.filename,
        original_filename=document.original_filename,
        status=document.status,
        page_count=document.page_count,
        detected_language=document.detected_language,
        language_override=document.language_override,
        ocr_confidence=document.ocr_confidence,
        ocr_processing_time=document.ocr_processing_time,
        file_size=document.file_size,
        error_message=document.error_message,
        created_at=document.created_at,
        updated_at=document.updated_at
    )

