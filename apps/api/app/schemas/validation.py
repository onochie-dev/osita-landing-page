"""
Validation Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class FlagSeverity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    BLOCKING = "blocking"


class FlagCategory(str, Enum):
    UNIT_CONSISTENCY = "unit_consistency"
    TOTALS_MISMATCH = "totals_mismatch"
    MISSING_REQUIRED = "missing_required"
    DATA_QUALITY = "data_quality"
    PERIOD_OVERLAP = "period_overlap"
    EXTRACTION_CONFIDENCE = "extraction_confidence"
    MANUAL_REVIEW = "manual_review"


class ValidationFlagResponse(BaseModel):
    """Response for a validation flag."""
    id: str
    code: str
    category: FlagCategory
    severity: FlagSeverity
    message: str
    suggestion: Optional[str]
    field_name: Optional[str]
    expected_value: Optional[str]
    actual_value: Optional[str]
    context: Optional[Dict[str, Any]]
    is_resolved: bool
    is_acknowledged: bool
    resolution_note: Optional[str]
    document_id: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class ValidationSummary(BaseModel):
    """Summary of validation status."""
    total_flags: int
    blocking_count: int
    warning_count: int
    info_count: int
    resolved_count: int
    acknowledged_count: int
    can_export: bool  # True if no unacknowledged blocking flags
    flags: List[ValidationFlagResponse] = []


class FlagAcknowledge(BaseModel):
    """Acknowledge or resolve a flag."""
    acknowledge: bool = False
    resolve: bool = False
    resolution_note: Optional[str] = None


class ValidationRuleConfig(BaseModel):
    """Configuration for a validation rule."""
    enabled: bool = True
    severity_override: Optional[FlagSeverity] = None
    threshold: Optional[float] = None  # For numeric checks
    custom_message: Optional[str] = None

