"""
Export Record Model
Tracks exports generated from projects.
"""
from sqlalchemy import Column, String, Text, Enum, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from .base import Base, TimestampMixin, generate_uuid


class ExportFormat(str, enum.Enum):
    """Export format types."""
    EXCEL = "excel"
    XML = "xml"
    ZIP = "zip"
    JSON = "json"


class ExportRecord(Base, TimestampMixin):
    """
    Record of an export operation.
    """
    __tablename__ = "export_records"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    
    # Export details
    format = Column(Enum(ExportFormat), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    
    # Metadata
    generated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    generated_by = Column(String(100), nullable=True)
    
    # Schema version (for XML)
    schema_version = Column(String(50), nullable=True)
    
    # Validation snapshot
    warnings_count = Column(String(10), default="0")
    blocking_flags_count = Column(String(10), default="0")
    acknowledged_flags = Column(Text, nullable=True)  # JSON list of acknowledged flag IDs
    
    # Relationships
    project = relationship("Project", back_populates="exports")

    def __repr__(self):
        return f"<ExportRecord(id={self.id}, format={self.format}, filename={self.filename})>"

