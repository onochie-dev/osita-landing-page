"""
Validation Service
Runs validation rules and generates flags.
"""
from typing import List, Dict, Any, Optional
from datetime import date, datetime
import re

from ..config import get_settings
from ..models.validation import FlagSeverity, FlagCategory, VALIDATION_CODES


class ValidationFlag:
    """A validation flag/issue."""
    def __init__(
        self,
        code: str,
        category: FlagCategory,
        severity: FlagSeverity,
        message: str,
        suggestion: Optional[str] = None,
        field_name: Optional[str] = None,
        expected_value: Optional[str] = None,
        actual_value: Optional[str] = None,
        context: Optional[Dict] = None,
        document_id: Optional[str] = None
    ):
        self.code = code
        self.category = category
        self.severity = severity
        self.message = message
        self.suggestion = suggestion
        self.field_name = field_name
        self.expected_value = expected_value
        self.actual_value = actual_value
        self.context = context or {}
        self.document_id = document_id
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "code": self.code,
            "category": self.category.value,
            "severity": self.severity.value,
            "message": self.message,
            "suggestion": self.suggestion,
            "field_name": self.field_name,
            "expected_value": self.expected_value,
            "actual_value": self.actual_value,
            "context": self.context,
            "document_id": self.document_id
        }


class ValidationResult:
    """Result of validation run."""
    def __init__(self, flags: List[ValidationFlag]):
        self.flags = flags
    
    @property
    def blocking_count(self) -> int:
        return sum(1 for f in self.flags if f.severity == FlagSeverity.BLOCKING)
    
    @property
    def warning_count(self) -> int:
        return sum(1 for f in self.flags if f.severity == FlagSeverity.WARNING)
    
    @property
    def info_count(self) -> int:
        return sum(1 for f in self.flags if f.severity == FlagSeverity.INFO)
    
    @property
    def can_export(self) -> bool:
        return self.blocking_count == 0
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "flags": [f.to_dict() for f in self.flags],
            "blocking_count": self.blocking_count,
            "warning_count": self.warning_count,
            "info_count": self.info_count,
            "can_export": self.can_export
        }


class ValidationService:
    """
    Service for validating extracted data.
    Runs a suite of validation rules and produces flags.
    """
    
    def __init__(self):
        self.settings = get_settings()
        self.tolerance_percent = self.settings.totals_tolerance_percent
    
    def validate_project(
        self,
        canonical_data: Dict[str, Any],
        project_settings: Dict[str, Any]
    ) -> ValidationResult:
        """
        Run all validations on a project's canonical data.
        
        Args:
            canonical_data: The aggregated canonical data for the project
            project_settings: Project configuration (emission factor, declarant, etc.)
            
        Returns:
            ValidationResult with all flags
        """
        flags: List[ValidationFlag] = []
        
        # Run each validation rule
        flags.extend(self._validate_completeness(canonical_data, project_settings))
        flags.extend(self._validate_units(canonical_data))
        flags.extend(self._validate_totals(canonical_data))
        flags.extend(self._validate_periods(canonical_data))
        flags.extend(self._validate_confidence(canonical_data))
        flags.extend(self._validate_emission_factor(project_settings))
        
        return ValidationResult(flags)
    
    def validate_document(
        self,
        extraction_data: Dict[str, Any],
        document_id: str
    ) -> ValidationResult:
        """
        Validate a single document's extraction.
        
        Args:
            extraction_data: The canonical data from extraction
            document_id: ID of the document being validated
            
        Returns:
            ValidationResult with document-level flags
        """
        flags: List[ValidationFlag] = []
        
        # Check if we have bills
        bills = extraction_data.get("electricity_bills", [])
        if not bills:
            flags.append(ValidationFlag(
                code="INCOMPLETE_EXTRACTION",
                category=FlagCategory.DATA_QUALITY,
                severity=FlagSeverity.WARNING,
                message="No billing data could be extracted from document",
                suggestion="Review the document manually and verify OCR quality",
                document_id=document_id
            ))
            return ValidationResult(flags)
        
        for bill in bills:
            # Check consumption
            if not bill.get("total_consumption"):
                flags.append(ValidationFlag(
                    code="MISSING_CONSUMPTION",
                    category=FlagCategory.MISSING_REQUIRED,
                    severity=FlagSeverity.BLOCKING,
                    message="Missing total consumption value",
                    suggestion="Enter the consumption value manually",
                    document_id=document_id
                ))
            
            # Check billing period
            period = bill.get("billing_period") or {}
            if not period.get("start_date") and not period.get("end_date"):
                flags.append(ValidationFlag(
                    code="MISSING_PERIOD",
                    category=FlagCategory.MISSING_REQUIRED,
                    severity=FlagSeverity.BLOCKING,
                    message="Missing billing period dates",
                    suggestion="Enter the billing period manually",
                    document_id=document_id
                ))
        
        return ValidationResult(flags)
    
    def _validate_completeness(
        self,
        canonical_data: Dict[str, Any],
        project_settings: Dict[str, Any]
    ) -> List[ValidationFlag]:
        """Check for required fields."""
        flags = []
        
        # Check reporting period
        if not canonical_data.get("reporting_period"):
            flags.append(ValidationFlag(
                code="MISSING_PERIOD",
                category=FlagCategory.MISSING_REQUIRED,
                severity=FlagSeverity.WARNING,
                message="Reporting period not set",
                suggestion="Set the quarterly reporting period (Q1-Q4) in project settings"
            ))
        
        # Check reporting year
        if not canonical_data.get("reporting_year"):
            flags.append(ValidationFlag(
                code="MISSING_PERIOD",
                category=FlagCategory.MISSING_REQUIRED,
                severity=FlagSeverity.WARNING,
                message="Reporting year not set",
                suggestion="Set the reporting year in project settings"
            ))
        
        # Check total electricity
        if not canonical_data.get("total_electricity_mwh"):
            flags.append(ValidationFlag(
                code="MISSING_CONSUMPTION",
                category=FlagCategory.MISSING_REQUIRED,
                severity=FlagSeverity.BLOCKING,
                message="No electricity consumption data found",
                suggestion="Upload electricity bills or enter consumption manually"
            ))
        
        # Check declarant info
        declarant = project_settings.get("declarant_info", {})
        if not declarant:
            flags.append(ValidationFlag(
                code="MISSING_REQUIRED",
                category=FlagCategory.MISSING_REQUIRED,
                severity=FlagSeverity.BLOCKING,
                message="Declarant information not provided",
                suggestion="Enter declarant details (name, ID, address) in project settings"
            ))
        elif not declarant.get("identification_number"):
            flags.append(ValidationFlag(
                code="MISSING_REQUIRED",
                category=FlagCategory.MISSING_REQUIRED,
                severity=FlagSeverity.BLOCKING,
                message="Declarant identification number (EORI) is required",
                suggestion="Enter the declarant's EORI number",
                field_name="declarant.identification_number"
            ))
        
        return flags
    
    def _validate_units(self, canonical_data: Dict[str, Any]) -> List[ValidationFlag]:
        """Validate unit consistency."""
        flags = []
        
        bills = canonical_data.get("electricity_bills", [])
        units_found = set()
        
        for bill in bills:
            tc = bill.get("total_consumption", {})
            if tc and tc.get("unit"):
                units_found.add(tc["unit"])
        
        # Check for mixed units
        if len(units_found) > 1:
            flags.append(ValidationFlag(
                code="UNIT_MIXED",
                category=FlagCategory.UNIT_CONSISTENCY,
                severity=FlagSeverity.WARNING,
                message=f"Mixed units detected across documents: {', '.join(units_found)}",
                suggestion="All values have been normalized to MWh for calculations",
                context={"units": list(units_found)}
            ))
        
        # Check for invalid units
        valid_units = {"kWh", "MWh", "TJ", "kwh", "mwh", "KWH", "MWH"}
        for unit in units_found:
            if unit not in valid_units:
                flags.append(ValidationFlag(
                    code="UNIT_INVALID",
                    category=FlagCategory.UNIT_CONSISTENCY,
                    severity=FlagSeverity.WARNING,
                    message=f"Unrecognized unit: {unit}",
                    suggestion="Verify and correct the consumption unit",
                    actual_value=unit
                ))
        
        return flags
    
    def _validate_totals(self, canonical_data: Dict[str, Any]) -> List[ValidationFlag]:
        """Validate totals reconciliation."""
        flags = []
        
        bills = canonical_data.get("electricity_bills", [])
        
        for bill in bills:
            line_items = bill.get("line_items", [])
            total = bill.get("total_consumption", {})
            
            if line_items and total and total.get("normalized_mwh"):
                # Sum line items
                line_sum = sum(
                    self._normalize_to_mwh(
                        item.get("quantity", 0),
                        item.get("unit", "kWh")
                    )
                    for item in line_items
                    if item.get("quantity")
                )
                
                total_mwh = total.get("normalized_mwh", 0)
                
                if total_mwh > 0 and line_sum > 0:
                    diff_percent = abs(total_mwh - line_sum) / total_mwh * 100
                    
                    if diff_percent > self.tolerance_percent:
                        flags.append(ValidationFlag(
                            code="TOTAL_LINE_MISMATCH",
                            category=FlagCategory.TOTALS_MISMATCH,
                            severity=FlagSeverity.WARNING,
                            message=f"Sum of line items ({line_sum:.3f} MWh) differs from total ({total_mwh:.3f} MWh) by {diff_percent:.1f}%",
                            suggestion="Review line items and total. Choose which value is authoritative.",
                            expected_value=str(total_mwh),
                            actual_value=str(line_sum),
                            document_id=bill.get("document_id")
                        ))
        
        return flags
    
    def _validate_periods(self, canonical_data: Dict[str, Any]) -> List[ValidationFlag]:
        """Validate billing periods for overlaps and gaps."""
        flags = []
        
        bills = canonical_data.get("electricity_bills", [])
        periods = []
        
        for bill in bills:
            bp = bill.get("billing_period", {})
            if bp.get("start_date") and bp.get("end_date"):
                try:
                    start = datetime.strptime(bp["start_date"], "%Y-%m-%d").date()
                    end = datetime.strptime(bp["end_date"], "%Y-%m-%d").date()
                    periods.append((start, end, bill.get("document_id")))
                except ValueError:
                    pass  # Invalid date format, skip
        
        # Check for overlaps
        for i, (start1, end1, doc1) in enumerate(periods):
            for start2, end2, doc2 in periods[i+1:]:
                if start1 <= end2 and start2 <= end1:
                    flags.append(ValidationFlag(
                        code="PERIOD_OVERLAP",
                        category=FlagCategory.PERIOD_OVERLAP,
                        severity=FlagSeverity.WARNING,
                        message=f"Overlapping billing periods detected",
                        suggestion="Review the billing periods to avoid double-counting",
                        context={
                            "period1": {"start": str(start1), "end": str(end1), "document": doc1},
                            "period2": {"start": str(start2), "end": str(end2), "document": doc2}
                        }
                    ))
        
        return flags
    
    def _validate_confidence(self, canonical_data: Dict[str, Any]) -> List[ValidationFlag]:
        """Flag low confidence extractions."""
        flags = []
        
        # This would check extraction confidence values
        # For now, return empty - would need field-level confidence data
        
        return flags
    
    def _validate_emission_factor(self, project_settings: Dict[str, Any]) -> List[ValidationFlag]:
        """Validate emission factor configuration."""
        flags = []
        
        source = project_settings.get("emission_factor_source", "commission_default")
        value = project_settings.get("emission_factor_value")
        
        if source == "provided" and not value:
            flags.append(ValidationFlag(
                code="MISSING_EMISSION_FACTOR",
                category=FlagCategory.MISSING_REQUIRED,
                severity=FlagSeverity.WARNING,
                message="Custom emission factor selected but no value provided",
                suggestion="Enter the emission factor value or use Commission default"
            ))
        
        return flags
    
    def _normalize_to_mwh(self, value: float, unit: str) -> float:
        """Convert to MWh for comparison."""
        unit_lower = unit.lower() if unit else "kwh"
        if unit_lower == "mwh":
            return value
        elif unit_lower == "kwh":
            return value / 1000
        elif unit_lower == "tj":
            return value * 277.778
        return value / 1000  # Default to kWh

