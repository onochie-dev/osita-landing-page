"""
Project Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class ProjectStatus(str, Enum):
    DRAFT = "draft"
    NEEDS_REVIEW = "needs_review"
    EXPORT_READY = "export_ready"
    EXPORTED = "exported"


class ReportingPeriod(str, Enum):
    Q1 = "Q1"
    Q2 = "Q2"
    Q3 = "Q3"
    Q4 = "Q4"


class ActorAddress(BaseModel):
    """Address structure matching CBAM XML schema."""
    country: str = Field(..., max_length=2, description="ISO 3166-1 alpha-2 country code")
    sub_division: Optional[str] = Field(None, max_length=128)
    city: str = Field(..., max_length=128)
    street: Optional[str] = Field(None, max_length=128)
    street_additional_line: Optional[str] = Field(None, max_length=128)
    number: Optional[str] = Field(None, max_length=32)
    postcode: Optional[str] = Field(None, max_length=32)
    po_box: Optional[str] = Field(None, max_length=32)


class DeclarantInfo(BaseModel):
    """Declarant information for CBAM report."""
    identification_number: str = Field(..., max_length=17, description="EORI number or equivalent")
    name: str = Field(..., max_length=256)
    role: Optional[str] = Field(None, max_length=128)
    address: Optional[ActorAddress] = None


class InstallationInfo(BaseModel):
    """Installation/site information."""
    name: Optional[str] = Field(None, max_length=256)
    identifier: Optional[str] = Field(None, max_length=128)
    country: Optional[str] = Field(None, max_length=2)
    address: Optional[ActorAddress] = None
    economic_activity: Optional[str] = None


class ProjectCreate(BaseModel):
    """Schema for creating a new project."""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    reporting_period: Optional[ReportingPeriod] = None
    reporting_year: Optional[str] = Field(None, pattern=r"^\d{4}$")
    declarant_info: Optional[DeclarantInfo] = None
    installation_info: Optional[InstallationInfo] = None
    emission_factor_source: str = Field(default="commission_default")
    emission_factor_value: Optional[str] = None


class ProjectUpdate(BaseModel):
    """Schema for updating a project."""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    reporting_period: Optional[ReportingPeriod] = None
    reporting_year: Optional[str] = Field(None, pattern=r"^\d{4}$")
    declarant_info: Optional[DeclarantInfo] = None
    installation_info: Optional[InstallationInfo] = None
    emission_factor_source: Optional[str] = None
    emission_factor_value: Optional[str] = None
    status: Optional[ProjectStatus] = None


class DocumentSummary(BaseModel):
    """Summary of a document in project list."""
    id: str
    filename: str
    status: str
    
    class Config:
        from_attributes = True


class ProjectResponse(BaseModel):
    """Full project response."""
    id: str
    name: str
    description: Optional[str]
    status: ProjectStatus
    reporting_period: Optional[ReportingPeriod]
    reporting_year: Optional[str]
    declarant_info: Optional[dict]
    installation_info: Optional[dict]
    emission_factor_source: str
    emission_factor_value: Optional[str]
    canonical_data: Optional[dict]
    documents: List[DocumentSummary] = []
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ProjectListResponse(BaseModel):
    """Project list item response."""
    id: str
    name: str
    status: ProjectStatus
    reporting_period: Optional[ReportingPeriod]
    reporting_year: Optional[str]
    document_count: int = 0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

