"""
Extraction Schemas - Canonical Data Model
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum


class FieldStatus(str, Enum):
    UNCONFIRMED = "unconfirmed"
    CONFIRMED = "confirmed"
    CORRECTED = "corrected"
    MANUAL = "manual"


class FieldType(str, Enum):
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


class Evidence(BaseModel):
    """Evidence for an extracted value."""
    document_id: str
    page_number: int
    quote: Optional[str] = None
    confidence: float = Field(..., ge=0, le=1)
    bbox: Optional[Dict[str, float]] = None  # x, y, width, height


class ExtractedFieldResponse(BaseModel):
    """Response for an extracted field."""
    id: str
    field_name: str
    field_type: FieldType
    value: Optional[str]
    unit: Optional[str]
    normalized_value: Optional[str]
    normalized_unit: Optional[str]
    confidence: Optional[float]
    status: FieldStatus
    source_page: Optional[int]
    source_quote: Optional[str]
    original_value: Optional[str]
    edit_reason: Optional[str]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class FieldUpdate(BaseModel):
    """Update an extracted field."""
    value: Optional[str] = None
    unit: Optional[str] = None
    status: Optional[FieldStatus] = None
    edit_reason: Optional[str] = None


class BillingPeriod(BaseModel):
    """Billing period information."""
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    period_string: Optional[str] = None  # Original extracted string


class ConsumptionValue(BaseModel):
    """Electricity consumption value."""
    value: float
    unit: str  # kWh or MWh
    normalized_mwh: float  # Always in MWh for calculation
    evidence: Optional[Evidence] = None


class LineItem(BaseModel):
    """Line item from bill."""
    description: Optional[str] = None
    consumption: Optional[ConsumptionValue] = None
    meter_id: Optional[str] = None
    amount: Optional[float] = None
    currency: Optional[str] = None


class ElectricityBill(BaseModel):
    """Extracted electricity bill data."""
    document_id: str
    supplier: Optional[str] = None
    billing_period: Optional[BillingPeriod] = None
    site_address: Optional[str] = None
    meter_ids: List[str] = []
    line_items: List[LineItem] = []
    total_consumption: Optional[ConsumptionValue] = None
    total_amount: Optional[float] = None
    currency: Optional[str] = None
    detected_language: Optional[str] = None
    

class IndirectEmission(BaseModel):
    """Calculated indirect emission."""
    electricity_consumed_mwh: float
    emission_factor: float  # tCO2/MWh
    emission_factor_source: str  # "commission_default" or "provided"
    emissions_tco2: float
    period_start: Optional[date] = None
    period_end: Optional[date] = None
    evidence_document_ids: List[str] = []


class CanonicalData(BaseModel):
    """
    Canonical Osita JSON - the internal contract between 
    extraction → validation → export.
    """
    # Report identification
    reporting_period: Optional[str] = None
    reporting_year: Optional[str] = None
    
    # Declarant (from project settings)
    declarant: Optional[Dict[str, Any]] = None
    
    # Installation (from project settings or extraction)
    installation: Optional[Dict[str, Any]] = None
    
    # Extracted billing data
    electricity_bills: List[ElectricityBill] = []
    
    # Aggregated values
    total_electricity_mwh: Optional[float] = None
    
    # Emission calculations
    indirect_emissions: List[IndirectEmission] = []
    total_indirect_emissions_tco2: Optional[float] = None
    
    # Validation summary
    validation_passed: bool = False
    blocking_flags_count: int = 0
    warning_flags_count: int = 0
    
    # Audit trail
    extraction_version: Optional[str] = None
    last_updated: Optional[datetime] = None


class ExtractionResponse(BaseModel):
    """Response for an extraction."""
    id: str
    document_id: str
    version: int
    is_current: bool
    model_name: Optional[str]
    processing_time: Optional[float]
    canonical_data: Optional[Dict[str, Any]]
    fields: List[ExtractedFieldResponse] = []
    created_at: datetime
    
    class Config:
        from_attributes = True

