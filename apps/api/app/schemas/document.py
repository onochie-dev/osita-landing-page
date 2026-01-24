"""
Document Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class DocumentStatus(str, Enum):
    UPLOADED = "uploaded"
    OCR_PROCESSING = "ocr_processing"
    OCR_COMPLETE = "ocr_complete"
    OCR_FAILED = "ocr_failed"
    EXTRACTION_PROCESSING = "extraction_processing"
    EXTRACTION_COMPLETE = "extraction_complete"
    EXTRACTION_FAILED = "extraction_failed"
    REVIEWED = "reviewed"


class DocumentLanguage(str, Enum):
    ENGLISH = "en"
    FRENCH = "fr"
    ARABIC = "ar"
    UNKNOWN = "unknown"


class DocumentUploadResponse(BaseModel):
    """Response after uploading a document."""
    id: str
    filename: str
    original_filename: str
    status: DocumentStatus
    file_size: Optional[int]
    message: str = "Document uploaded successfully"
    
    class Config:
        from_attributes = True


class DocumentResponse(BaseModel):
    """Full document response."""
    id: str
    project_id: str
    filename: str
    original_filename: str
    status: DocumentStatus
    page_count: Optional[int]
    detected_language: Optional[DocumentLanguage]
    language_override: Optional[DocumentLanguage]
    ocr_confidence: Optional[float]
    ocr_processing_time: Optional[float]
    file_size: Optional[int]
    error_message: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    """List of documents."""
    documents: List[DocumentResponse]
    total: int

