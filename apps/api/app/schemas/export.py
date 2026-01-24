"""
Export Schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class ExportFormat(str, Enum):
    EXCEL = "excel"
    XML = "xml"
    ZIP = "zip"
    JSON = "json"


class ExportRequest(BaseModel):
    """Request to generate an export."""
    format: ExportFormat
    include_evidence: bool = True
    include_validation_summary: bool = True
    acknowledge_blocking_flags: bool = False  # If True, export even with blocking flags


class ExportResponse(BaseModel):
    """Response from export generation."""
    id: str
    format: ExportFormat
    filename: str
    download_url: str
    generated_at: datetime
    warnings_count: int
    blocking_flags_count: int
    
    class Config:
        from_attributes = True


class ExcelExportData(BaseModel):
    """Data structure for Excel export."""
    # Summary sheet
    project_name: str
    reporting_period: Optional[str]
    reporting_year: Optional[str]
    total_electricity_mwh: Optional[float]
    total_emissions_tco2: Optional[float]
    emission_factor_source: str
    emission_factor_value: Optional[float]
    
    # Declarant sheet
    declarant: Optional[Dict[str, Any]]
    
    # Bills sheet - one row per document
    bills: List[Dict[str, Any]]
    
    # Validation sheet
    validation_flags: List[Dict[str, Any]]
    
    # Evidence sheet
    evidence_items: List[Dict[str, Any]]


class CBAMGoodsCategory(BaseModel):
    """CBAM goods category for XML."""
    cn_code: str  # Combined Nomenclature code
    goods_description: Optional[str]
    import_quantity: float
    import_unit: str
    origin_country: str


class XMLExportData(BaseModel):
    """Data structure for CBAM XML export."""
    # Header
    reporting_period: str  # Q1, Q2, Q3, Q4
    year: int
    
    # Totals
    total_imported: float
    total_emissions: float
    
    # Declarant
    declarant_id: str
    declarant_name: str
    declarant_role: Optional[str]
    declarant_address: Dict[str, Any]
    
    # Imported goods (for electricity-only, this maps to the electricity section)
    imported_goods: List[Dict[str, Any]]
    
    # Indirect emissions
    indirect_emissions: List[Dict[str, Any]]
    
    # Import area
    import_area: str = "EU"  # EU or EUOTH

