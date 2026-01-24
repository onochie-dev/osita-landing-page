"""
Export API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
import io
from datetime import datetime
import uuid

from ..database import get_db
from ..models.project import Project, ProjectStatus
from ..models.document import Document, DocumentStatus
from ..models.extraction import Extraction, ExtractedField
from ..models.export import ExportRecord, ExportFormat
from ..models.validation import ValidationFlag
from ..schemas.export import ExportRequest, ExportResponse
from ..services.export_service import ExportService

router = APIRouter()


@router.post("/project/{project_id}/excel")
async def export_excel(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Generate and download Excel export."""
    project, canonical_data, validation_flags, evidence_items = _get_export_data(db, project_id)
    
    export_service = ExportService()
    excel_bytes = export_service.generate_excel(
        project_data=_project_to_dict(project),
        canonical_data=canonical_data,
        validation_flags=validation_flags,
        evidence_items=evidence_items
    )
    
    # Record export
    _record_export(db, project_id, ExportFormat.EXCEL, f"osita_report_{project_id[:8]}.xlsx")
    
    filename = f"osita_cbam_report_{datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
    
    return StreamingResponse(
        io.BytesIO(excel_bytes),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.post("/project/{project_id}/xml")
async def export_xml(
    project_id: str,
    as_download: bool = False,
    db: Session = Depends(get_db)
):
    """
    Generate XML export.
    Returns XML content for copy/paste by default, or as download if as_download=true.
    """
    project, canonical_data, _, _ = _get_export_data(db, project_id)
    
    export_service = ExportService()
    xml_content = export_service.generate_xml(
        project_data=_project_to_dict(project),
        canonical_data=canonical_data
    )
    
    # Record export
    _record_export(db, project_id, ExportFormat.XML, f"cbam_report_{project_id[:8]}.xml")
    
    if as_download:
        filename = f"cbam_report_{datetime.now().strftime('%Y%m%d_%H%M')}.xml"
        return StreamingResponse(
            io.BytesIO(xml_content.encode("utf-8")),
            media_type="application/xml",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    
    # Return XML for copy/paste
    return Response(
        content=xml_content,
        media_type="application/xml"
    )


@router.post("/project/{project_id}/zip")
async def export_zip(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Generate ZIP package with XML and Excel."""
    project, canonical_data, validation_flags, evidence_items = _get_export_data(db, project_id)
    
    export_service = ExportService()
    zip_bytes = export_service.generate_zip(
        project_data=_project_to_dict(project),
        canonical_data=canonical_data,
        validation_flags=validation_flags,
        evidence_items=evidence_items
    )
    
    # Record export
    _record_export(db, project_id, ExportFormat.ZIP, f"cbam_package_{project_id[:8]}.zip")
    
    # Update project status
    project.status = ProjectStatus.EXPORTED
    db.commit()
    
    filename = f"cbam_package_{datetime.now().strftime('%Y%m%d_%H%M')}.zip"
    
    return StreamingResponse(
        io.BytesIO(zip_bytes),
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


@router.get("/project/{project_id}/preview-xml")
async def preview_xml(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Preview XML without recording as export."""
    project, canonical_data, _, _ = _get_export_data(db, project_id, allow_incomplete=True)
    
    export_service = ExportService()
    xml_content = export_service.generate_xml(
        project_data=_project_to_dict(project),
        canonical_data=canonical_data
    )
    
    return {"xml": xml_content}


@router.get("/project/{project_id}/history")
async def get_export_history(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Get export history for a project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    exports = db.query(ExportRecord).filter(
        ExportRecord.project_id == project_id
    ).order_by(ExportRecord.generated_at.desc()).all()
    
    return [
        {
            "id": e.id,
            "format": e.format.value,
            "filename": e.filename,
            "generated_at": e.generated_at.isoformat(),
            "warnings_count": e.warnings_count,
            "blocking_flags_count": e.blocking_flags_count
        }
        for e in exports
    ]


def _get_export_data(db: Session, project_id: str, allow_incomplete: bool = False):
    """Get all data needed for export."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    canonical_data = project.canonical_data or {}
    
    # Get validation flags
    flags = db.query(ValidationFlag).filter(
        ValidationFlag.project_id == project_id
    ).all()
    
    validation_flags = [
        {
            "code": f.code,
            "severity": f.severity.value,
            "category": f.category.value,
            "message": f.message,
            "suggestion": f.suggestion,
            "is_resolved": f.is_resolved,
            "is_acknowledged": f.is_acknowledged
        }
        for f in flags
    ]
    
    # Check for blocking flags
    blocking_count = sum(1 for f in flags if f.severity.value == "blocking" and not f.is_acknowledged)
    if blocking_count > 0 and not allow_incomplete:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot export: {blocking_count} blocking issue(s) must be acknowledged first"
        )
    
    # Get evidence items from fields
    evidence_items = []
    documents = db.query(Document).filter(Document.project_id == project_id).all()
    
    for doc in documents:
        extraction = db.query(Extraction).filter(
            Extraction.document_id == doc.id,
            Extraction.is_current == True
        ).first()
        
        if extraction:
            for field in extraction.fields:
                evidence_items.append({
                    "field_name": field.field_name,
                    "value": field.value,
                    "document_id": doc.id,
                    "document_name": doc.original_filename,
                    "source_page": field.source_page,
                    "source_quote": field.source_quote,
                    "confidence": field.confidence
                })
    
    return project, canonical_data, validation_flags, evidence_items


def _project_to_dict(project: Project) -> dict:
    """Convert project to dict for export services."""
    return {
        "id": project.id,
        "name": project.name,
        "description": project.description,
        "status": project.status.value,
        "reporting_period": project.reporting_period.value if project.reporting_period else None,
        "reporting_year": project.reporting_year,
        "declarant_info": project.declarant_info,
        "installation_info": project.installation_info,
        "emission_factor_source": project.emission_factor_source,
        "emission_factor_value": project.emission_factor_value
    }


def _record_export(db: Session, project_id: str, format: ExportFormat, filename: str):
    """Record an export in the database."""
    # Count flags
    flags = db.query(ValidationFlag).filter(
        ValidationFlag.project_id == project_id
    ).all()
    
    warnings = sum(1 for f in flags if f.severity.value == "warning")
    blocking = sum(1 for f in flags if f.severity.value == "blocking")
    
    export_record = ExportRecord(
        id=str(uuid.uuid4()),
        project_id=project_id,
        format=format,
        filename=filename,
        file_path="",  # Not stored on disk
        warnings_count=str(warnings),
        blocking_flags_count=str(blocking)
    )
    
    db.add(export_record)
    db.commit()

