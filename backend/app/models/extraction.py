"""
Extraction Models
Represents extracted data from documents.
"""
from sqlalchemy import Column, String, Text, Enum, Integer, Float, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
import enum

from .base import Base, TimestampMixin, generate_uuid


class FieldStatus(str, enum.Enum):
    """Status of an extracted field."""
    UNCONFIRMED = "unconfirmed"
    CONFIRMED = "confirmed"
    CORRECTED = "corrected"
    MANUAL = "manual"


class FieldType(str, enum.Enum):
    """Type of extracted field."""
    CONSUMPTION = "consumption"
    UNIT = "unit"
    PERIOD_START = "period_start"
    PERIOD_END = "period_end"
    BILLING_PERIOD = "billing_period"
    METER_ID = "meter_id"
    SITE_ADDRESS = "site_address"
    SUPPLIER = "supplier"
    TOTAL_AMOUNT = "total_amount"
    CURRENCY = "currency"
    LINE_ITEM = "line_item"
    TOTAL_CONSUMPTION = "total_consumption"
    OTHER = "other"


class Extraction(Base, TimestampMixin):
    """
    A single extraction run for a document.
    Versioned to track changes over time.
    """
    __tablename__ = "extractions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    
    # Version tracking
    version = Column(Integer, default=1, nullable=False)
    is_current = Column(Boolean, default=True, nullable=False)
    
    # Model metadata
    model_name = Column(String(100), nullable=True)
    model_version = Column(String(50), nullable=True)
    
    # Processing info
    processing_time = Column(Float, nullable=True)  # seconds
    
    # Raw extraction output
    raw_output = Column(JSON, nullable=True)
    
    # Structured canonical data
    canonical_data = Column(JSON, nullable=True)
    
    # Relationships
    document = relationship("Document", back_populates="extractions")
    fields = relationship("ExtractedField", back_populates="extraction", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Extraction(id={self.id}, document_id={self.document_id}, version={self.version})>"


class ExtractedField(Base, TimestampMixin):
    """
    A single extracted field with evidence and audit trail.
    """
    __tablename__ = "extracted_fields"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    extraction_id = Column(String(36), ForeignKey("extractions.id"), nullable=False)
    
    # Field identification
    field_name = Column(String(100), nullable=False)
    field_type = Column(Enum(FieldType), default=FieldType.OTHER, nullable=False)
    
    # Value and unit
    value = Column(Text, nullable=True)
    unit = Column(String(50), nullable=True)
    normalized_value = Column(Text, nullable=True)  # After unit normalization
    normalized_unit = Column(String(50), nullable=True)
    
    # Confidence and status
    confidence = Column(Float, nullable=True)  # 0.0 to 1.0
    status = Column(Enum(FieldStatus), default=FieldStatus.UNCONFIRMED, nullable=False)
    
    # Evidence / Citation
    source_page = Column(Integer, nullable=True)
    source_quote = Column(Text, nullable=True)  # Original text snippet
    source_bbox = Column(JSON, nullable=True)  # Bounding box if available
    
    # User edits
    original_value = Column(Text, nullable=True)  # If user corrected
    edit_reason = Column(Text, nullable=True)
    edited_by = Column(String(100), nullable=True)
    
    # Relationships
    extraction = relationship("Extraction", back_populates="fields")

    def __repr__(self):
        return f"<ExtractedField(id={self.id}, name={self.field_name}, value={self.value})>"

