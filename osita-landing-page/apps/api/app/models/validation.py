"""
Validation Models
Represents validation flags and checks.
"""
from sqlalchemy import Column, String, Text, Enum, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
import enum

from .base import Base, TimestampMixin, generate_uuid


class FlagSeverity(str, enum.Enum):
    """Severity level of validation flags."""
    INFO = "info"
    WARNING = "warning"
    BLOCKING = "blocking"


class FlagCategory(str, enum.Enum):
    """Category of validation flag."""
    UNIT_CONSISTENCY = "unit_consistency"
    TOTALS_MISMATCH = "totals_mismatch"
    MISSING_REQUIRED = "missing_required"
    DATA_QUALITY = "data_quality"
    PERIOD_OVERLAP = "period_overlap"
    EXTRACTION_CONFIDENCE = "extraction_confidence"
    MANUAL_REVIEW = "manual_review"


class ValidationFlag(Base, TimestampMixin):
    """
    A validation flag raised during processing.
    """
    __tablename__ = "validation_flags"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=True)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=True)
    
    # Flag identification
    code = Column(String(50), nullable=False)
    category = Column(Enum(FlagCategory), nullable=False)
    severity = Column(Enum(FlagSeverity), nullable=False)
    
    # Details
    message = Column(Text, nullable=False)
    suggestion = Column(Text, nullable=True)  # "What to do next"
    
    # Context
    field_name = Column(String(100), nullable=True)
    expected_value = Column(Text, nullable=True)
    actual_value = Column(Text, nullable=True)
    context = Column(JSON, nullable=True)  # Additional context data
    
    # Resolution
    is_resolved = Column(Boolean, default=False, nullable=False)
    is_acknowledged = Column(Boolean, default=False, nullable=False)
    resolution_note = Column(Text, nullable=True)
    resolved_by = Column(String(100), nullable=True)
    
    # Relationships
    project = relationship("Project", backref="validation_flags")
    document = relationship("Document", back_populates="validation_flags")

    def __repr__(self):
        return f"<ValidationFlag(id={self.id}, code={self.code}, severity={self.severity})>"


# Predefined validation flag codes
VALIDATION_CODES = {
    # Unit consistency
    "UNIT_MIXED": ("Mixed units detected in document", FlagCategory.UNIT_CONSISTENCY, FlagSeverity.WARNING),
    "UNIT_AMBIGUOUS": ("Ambiguous unit string", FlagCategory.UNIT_CONSISTENCY, FlagSeverity.WARNING),
    "UNIT_INVALID": ("Invalid or unrecognized unit", FlagCategory.UNIT_CONSISTENCY, FlagSeverity.BLOCKING),
    
    # Totals mismatch
    "TOTAL_LINE_MISMATCH": ("Sum of line items doesn't match total", FlagCategory.TOTALS_MISMATCH, FlagSeverity.WARNING),
    "TOTAL_METER_MISMATCH": ("Sum of meters doesn't match site total", FlagCategory.TOTALS_MISMATCH, FlagSeverity.WARNING),
    
    # Missing required
    "MISSING_PERIOD": ("Missing billing period", FlagCategory.MISSING_REQUIRED, FlagSeverity.BLOCKING),
    "MISSING_CONSUMPTION": ("Missing consumption total", FlagCategory.MISSING_REQUIRED, FlagSeverity.BLOCKING),
    "MISSING_UNIT": ("Missing consumption unit", FlagCategory.MISSING_REQUIRED, FlagSeverity.BLOCKING),
    "MISSING_EMISSION_FACTOR": ("Missing emission factor basis", FlagCategory.MISSING_REQUIRED, FlagSeverity.WARNING),
    
    # Data quality
    "LOW_CONFIDENCE": ("Low extraction confidence", FlagCategory.EXTRACTION_CONFIDENCE, FlagSeverity.INFO),
    "OCR_QUALITY": ("OCR quality issues detected", FlagCategory.DATA_QUALITY, FlagSeverity.WARNING),
    "INCOMPLETE_EXTRACTION": ("Some fields could not be extracted", FlagCategory.DATA_QUALITY, FlagSeverity.WARNING),
    
    # Period issues
    "PERIOD_OVERLAP": ("Overlapping billing periods detected", FlagCategory.PERIOD_OVERLAP, FlagSeverity.WARNING),
    "PERIOD_GAP": ("Gap in billing periods", FlagCategory.PERIOD_OVERLAP, FlagSeverity.INFO),
}

