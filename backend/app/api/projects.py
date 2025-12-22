"""
Project API Routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json

from ..database import get_db
from ..models.project import Project, ProjectStatus
from ..schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectListResponse,
    DocumentSummary
)
from ..services.validation_service import ValidationService

router = APIRouter()


@router.get("", response_model=List[ProjectListResponse])
async def list_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """List all projects."""
    projects = db.query(Project).offset(skip).limit(limit).all()
    
    result = []
    for p in projects:
        result.append(ProjectListResponse(
            id=p.id,
            name=p.name,
            status=p.status,
            reporting_period=p.reporting_period,
            reporting_year=p.reporting_year,
            document_count=len(p.documents) if p.documents else 0,
            created_at=p.created_at,
            updated_at=p.updated_at
        ))
    
    return result


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a new project."""
    project = Project(
        name=project_in.name,
        description=project_in.description,
        reporting_period=project_in.reporting_period,
        reporting_year=project_in.reporting_year,
        declarant_info=project_in.declarant_info.model_dump() if project_in.declarant_info else None,
        installation_info=project_in.installation_info.model_dump() if project_in.installation_info else None,
        emission_factor_source=project_in.emission_factor_source,
        emission_factor_value=project_in.emission_factor_value,
        status=ProjectStatus.DRAFT
    )
    
    db.add(project)
    db.commit()
    db.refresh(project)
    
    return _project_to_response(project)


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Get a project by ID."""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return _project_to_response(project)


@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db)
):
    """Update a project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    update_data = project_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        if field == "declarant_info" and value:
            setattr(project, field, value.model_dump() if hasattr(value, 'model_dump') else value)
        elif field == "installation_info" and value:
            setattr(project, field, value.model_dump() if hasattr(value, 'model_dump') else value)
        else:
            setattr(project, field, value)
    
    db.commit()
    db.refresh(project)
    
    return _project_to_response(project)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Delete a project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(project)
    db.commit()


@router.post("/{project_id}/validate")
async def validate_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Run validation on a project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    validation_service = ValidationService()
    
    # Prepare project settings
    project_settings = {
        "declarant_info": project.declarant_info,
        "installation_info": project.installation_info,
        "emission_factor_source": project.emission_factor_source,
        "emission_factor_value": project.emission_factor_value
    }
    
    # Run validation
    result = validation_service.validate_project(
        canonical_data=project.canonical_data or {},
        project_settings=project_settings
    )
    
    # Update project status based on validation
    if result.blocking_count == 0:
        project.status = ProjectStatus.EXPORT_READY
    else:
        project.status = ProjectStatus.NEEDS_REVIEW
    
    db.commit()
    
    return result.to_dict()


def _project_to_response(project: Project) -> ProjectResponse:
    """Convert project model to response schema."""
    documents = []
    if project.documents:
        for doc in project.documents:
            documents.append(DocumentSummary(
                id=doc.id,
                filename=doc.filename,
                status=doc.status.value
            ))
    
    return ProjectResponse(
        id=project.id,
        name=project.name,
        description=project.description,
        status=project.status,
        reporting_period=project.reporting_period,
        reporting_year=project.reporting_year,
        declarant_info=project.declarant_info,
        installation_info=project.installation_info,
        emission_factor_source=project.emission_factor_source,
        emission_factor_value=project.emission_factor_value,
        canonical_data=project.canonical_data,
        documents=documents,
        created_at=project.created_at,
        updated_at=project.updated_at
    )

