"""
Document Model
Represents an uploaded PDF document.
"""
from sqlalchemy import Column, String, Text, Enum, Integer, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
import enum

from .base import Base, TimestampMixin, generate_uuid


class DocumentStatus(str, enum.Enum):
    """Processing status of a document."""
    UPLOADED = "uploaded"
    OCR_PROCESSING = "ocr_processing"
    OCR_COMPLETE = "ocr_complete"
    OCR_FAILED = "ocr_failed"
    EXTRACTION_PROCESSING = "extraction_processing"
    EXTRACTION_COMPLETE = "extraction_complete"
    EXTRACTION_FAILED = "extraction_failed"
    REVIEWED = "reviewed"


class DocumentLanguage(str, enum.Enum):
    """Detected document language."""
    ENGLISH = "en"
    FRENCH = "fr"
    ARABIC = "ar"
    UNKNOWN = "unknown"


class Document(Base, TimestampMixin):
    """
    An uploaded PDF document (energy bill).
    """
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    
    # File Information
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, nullable=True)
    mime_type = Column(String(100), default="application/pdf")
    
    # Processing Status
    status = Column(Enum(DocumentStatus), default=DocumentStatus.UPLOADED, nullable=False)
    
    # OCR Metadata
    page_count = Column(Integer, nullable=True)
    detected_language = Column(Enum(DocumentLanguage), default=DocumentLanguage.UNKNOWN)
    ocr_confidence = Column(Float, nullable=True)
    ocr_processing_time = Column(Float, nullable=True)  # seconds
    
    # OCR Output Storage
    ocr_output_path = Column(String(512), nullable=True)  # Path to OCR JSON
    ocr_raw_output = Column(JSON, nullable=True)  # Store directly for small docs
    
    # Error Tracking
    error_message = Column(Text, nullable=True)
    
    # User Override
    language_override = Column(Enum(DocumentLanguage), nullable=True)
    
    # Relationships
    project = relationship("Project", back_populates="documents")
    extractions = relationship("Extraction", back_populates="document", cascade="all, delete-orphan")
    validation_flags = relationship("ValidationFlag", back_populates="document", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Document(id={self.id}, filename={self.filename}, status={self.status})>"

