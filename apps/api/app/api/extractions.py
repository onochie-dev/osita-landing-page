"""
Extraction API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models.document import Document
from ..models.extraction import Extraction, ExtractedField, FieldStatus
from ..schemas.extraction import (
    ExtractionResponse,
    ExtractedFieldResponse,
    FieldUpdate
)

router = APIRouter()


@router.get("/document/{document_id}", response_model=ExtractionResponse)
async def get_document_extraction(
    document_id: str,
    version: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get extraction data for a document.
    Returns the current version by default, or specific version if provided.
    """
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    query = db.query(Extraction).filter(Extraction.document_id == document_id)
    
    if version:
        extraction = query.filter(Extraction.version == version).first()
    else:
        extraction = query.filter(Extraction.is_current == True).first()
    
    if not extraction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No extraction found for document"
        )
    
    return _extraction_to_response(extraction)


@router.get("/document/{document_id}/fields", response_model=List[ExtractedFieldResponse])
async def get_document_fields(
    document_id: str,
    db: Session = Depends(get_db)
):
    """Get all extracted fields for a document's current extraction."""
    extraction = db.query(Extraction).filter(
        Extraction.document_id == document_id,
        Extraction.is_current == True
    ).first()
    
    if not extraction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No extraction found for document"
        )
    
    fields = db.query(ExtractedField).filter(
        ExtractedField.extraction_id == extraction.id
    ).all()
    
    return [_field_to_response(f) for f in fields]


@router.get("/field/{field_id}", response_model=ExtractedFieldResponse)
async def get_field(
    field_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific extracted field."""
    field = db.query(ExtractedField).filter(ExtractedField.id == field_id).first()
    
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field not found"
        )
    
    return _field_to_response(field)


@router.put("/field/{field_id}", response_model=ExtractedFieldResponse)
async def update_field(
    field_id: str,
    field_update: FieldUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an extracted field.
    Used for manual corrections during review.
    """
    field = db.query(ExtractedField).filter(ExtractedField.id == field_id).first()
    
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field not found"
        )
    
    # Store original value if this is the first edit
    if field_update.value is not None and field.original_value is None:
        field.original_value = field.value
    
    # Apply updates
    if field_update.value is not None:
        field.value = field_update.value
        if field.status == FieldStatus.UNCONFIRMED:
            field.status = FieldStatus.CORRECTED
    
    if field_update.unit is not None:
        field.unit = field_update.unit
    
    if field_update.status is not None:
        field.status = field_update.status
    
    if field_update.edit_reason:
        field.edit_reason = field_update.edit_reason
    
    db.commit()
    db.refresh(field)
    
    # Recalculate canonical data after edit
    _recalculate_extraction_canonical(db, field.extraction_id)
    
    return _field_to_response(field)


@router.post("/field/{field_id}/confirm", response_model=ExtractedFieldResponse)
async def confirm_field(
    field_id: str,
    db: Session = Depends(get_db)
):
    """Confirm an extracted field value."""
    field = db.query(ExtractedField).filter(ExtractedField.id == field_id).first()
    
    if not field:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Field not found"
        )
    
    field.status = FieldStatus.CONFIRMED
    db.commit()
    db.refresh(field)
    
    return _field_to_response(field)


@router.post("/document/{document_id}/confirm-all")
async def confirm_all_fields(
    document_id: str,
    db: Session = Depends(get_db)
):
    """Confirm all unconfirmed fields for a document."""
    extraction = db.query(Extraction).filter(
        Extraction.document_id == document_id,
        Extraction.is_current == True
    ).first()
    
    if not extraction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No extraction found for document"
        )
    
    updated = db.query(ExtractedField).filter(
        ExtractedField.extraction_id == extraction.id,
        ExtractedField.status == FieldStatus.UNCONFIRMED
    ).update({"status": FieldStatus.CONFIRMED})
    
    db.commit()
    
    return {"confirmed_count": updated}


def _recalculate_extraction_canonical(db: Session, extraction_id: str):
    """Recalculate canonical data from fields after edit."""
    extraction = db.query(Extraction).filter(Extraction.id == extraction_id).first()
    if not extraction:
        return
    
    fields = db.query(ExtractedField).filter(
        ExtractedField.extraction_id == extraction_id
    ).all()
    
    # Rebuild canonical data from fields
    canonical = extraction.canonical_data or {}
    
    for field in fields:
        if field.field_name == "total_consumption" and field.value:
            try:
                value = float(field.value.replace(",", ""))
                unit = field.unit or "kWh"
                
                # Normalize to MWh
                if unit.lower() == "kwh":
                    normalized_mwh = value / 1000
                elif unit.lower() == "mwh":
                    normalized_mwh = value
                else:
                    normalized_mwh = value / 1000
                
                if "electricity_bills" in canonical and canonical["electricity_bills"]:
                    canonical["electricity_bills"][0]["total_consumption"] = {
                        "value": value,
                        "unit": unit,
                        "normalized_mwh": normalized_mwh
                    }
                canonical["total_electricity_mwh"] = normalized_mwh
            except ValueError:
                pass
    
    extraction.canonical_data = canonical
    db.commit()


def _extraction_to_response(extraction: Extraction) -> ExtractionResponse:
    """Convert extraction model to response schema."""
    fields = [_field_to_response(f) for f in extraction.fields] if extraction.fields else []
    
    return ExtractionResponse(
        id=extraction.id,
        document_id=extraction.document_id,
        version=extraction.version,
        is_current=extraction.is_current,
        model_name=extraction.model_name,
        processing_time=extraction.processing_time,
        canonical_data=extraction.canonical_data,
        fields=fields,
        created_at=extraction.created_at
    )


def _field_to_response(field: ExtractedField) -> ExtractedFieldResponse:
    """Convert field model to response schema."""
    return ExtractedFieldResponse(
        id=field.id,
        field_name=field.field_name,
        field_type=field.field_type,
        value=field.value,
        unit=field.unit,
        normalized_value=field.normalized_value,
        normalized_unit=field.normalized_unit,
        confidence=field.confidence,
        status=field.status,
        source_page=field.source_page,
        source_quote=field.source_quote,
        original_value=field.original_value,
        edit_reason=field.edit_reason,
        created_at=field.created_at,
        updated_at=field.updated_at
    )

