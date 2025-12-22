"""
Project Model
Represents a CBAM filing project.
"""
from sqlalchemy import Column, String, Text, Enum, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .base import Base, TimestampMixin, generate_uuid


class ProjectStatus(str, enum.Enum):
    """Status of a project."""
    DRAFT = "draft"
    NEEDS_REVIEW = "needs_review"
    EXPORT_READY = "export_ready"
    EXPORTED = "exported"


class ReportingPeriod(str, enum.Enum):
    """CBAM quarterly reporting period."""
    Q1 = "Q1"
    Q2 = "Q2"
    Q3 = "Q3"
    Q4 = "Q4"


class Project(Base, TimestampMixin):
    """
    A CBAM filing project containing documents and extracted data.
    """
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.DRAFT, nullable=False)
    
    # Reporting Period Info
    reporting_period = Column(Enum(ReportingPeriod), nullable=True)
    reporting_year = Column(String(4), nullable=True)
    
    # Declarant Information (manual input)
    declarant_info = Column(JSON, nullable=True)
    
    # Installation Information
    installation_info = Column(JSON, nullable=True)
    
    # Emission Factor Settings
    emission_factor_source = Column(String(50), default="commission_default")
    emission_factor_value = Column(String(50), nullable=True)
    emission_factor_unit = Column(String(20), default="tCO2/MWh")
    
    # Canonical extracted data (aggregated from all documents)
    canonical_data = Column(JSON, nullable=True)
    
    # Relationships
    documents = relationship("Document", back_populates="project", cascade="all, delete-orphan")
    exports = relationship("ExportRecord", back_populates="project", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Project(id={self.id}, name={self.name}, status={self.status})>"

