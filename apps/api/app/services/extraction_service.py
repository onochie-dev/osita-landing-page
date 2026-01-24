"""
Extraction Service - OpenAI Structured Extraction
Converts OCR markdown to canonical Osita JSON using OpenAI.
"""
import json
import time
from typing import Optional, Dict, Any, List
from datetime import datetime
import re
from openai import AsyncOpenAI

from ..config import get_settings
from .ocr_service import OCRResult


class ExtractionResult:
    """Result from structured extraction."""
    def __init__(
        self,
        canonical_data: Dict[str, Any],
        fields: List[Dict[str, Any]],
        processing_time: float = 0.0,
        model_name: str = "gpt-4-turbo-preview",
        raw_response: Optional[Dict] = None
    ):
        self.canonical_data = canonical_data
        self.fields = fields
        self.processing_time = processing_time
        self.model_name = model_name
        self.raw_response = raw_response


# JSON Schema for extraction output
EXTRACTION_SCHEMA = {
    "type": "object",
    "properties": {
        "supplier": {
            "type": "string",
            "description": "Energy supplier/company name"
        },
        "account_number": {
            "type": "string",
            "description": "Customer account number"
        },
        "billing_period": {
            "type": "object",
            "properties": {
                "start_date": {"type": "string", "description": "Start date in YYYY-MM-DD format"},
                "end_date": {"type": "string", "description": "End date in YYYY-MM-DD format"},
                "period_string": {"type": "string", "description": "Original period text from document"}
            }
        },
        "site_address": {
            "type": "string",
            "description": "Service location address"
        },
        "meter_readings": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "meter_id": {"type": "string"},
                    "reading_start": {"type": "number"},
                    "reading_end": {"type": "number"},
                    "consumption": {"type": "number"},
                    "unit": {"type": "string", "enum": ["kWh", "MWh", "TJ"]}
                }
            }
        },
        "line_items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "description": {"type": "string"},
                    "quantity": {"type": "number"},
                    "unit": {"type": "string"},
                    "amount": {"type": "number"},
                    "currency": {"type": "string"}
                }
            }
        },
        "total_consumption": {
            "type": "object",
            "properties": {
                "value": {"type": "number"},
                "unit": {"type": "string", "enum": ["kWh", "MWh", "TJ"]}
            }
        },
        "total_amount": {
            "type": "object",
            "properties": {
                "value": {"type": "number"},
                "currency": {"type": "string"}
            }
        },
        "evidence": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "field": {"type": "string"},
                    "page": {"type": "integer"},
                    "quote": {"type": "string"},
                    "confidence": {"type": "number", "minimum": 0, "maximum": 1}
                }
            }
        }
    },
    "required": ["evidence"]
}


EXTRACTION_PROMPT = """You are an expert at extracting structured data from electricity bills and energy documents.

Analyze the following OCR text from an electricity bill and extract all relevant information.

IMPORTANT RULES:
1. Extract all consumption values with their units (kWh, MWh, or TJ)
2. Parse dates into YYYY-MM-DD format when possible
3. For each extracted value, provide evidence: the page number and exact quote from the text
4. Estimate confidence (0-1) for each extraction based on clarity of the source text
5. If a value is ambiguous or unclear, still extract it but with lower confidence
6. Handle multiple meters/sites if present
7. Support multilingual content (English, French, Arabic)

OCR TEXT:
{ocr_text}

Extract the information according to the schema and provide evidence for each field.
"""


class ExtractionService:
    """
    Service for extracting structured data from OCR output.
    Uses OpenAI GPT-4 with structured output.
    Supports fine-tuned models for improved accuracy.
    """
    
    def __init__(self):
        self.settings = get_settings()
        self.client = AsyncOpenAI(api_key=self.settings.openai_api_key)
        # Use fine-tuned model if available, otherwise default
        finetuned = getattr(self.settings, 'openai_finetuned_model', None)
        self.model = finetuned if finetuned else "gpt-4-turbo-preview"
        self.is_finetuned = bool(finetuned and finetuned.startswith("ft:"))
    
    async def extract_from_ocr(
        self, 
        ocr_result: OCRResult,
        document_id: str
    ) -> ExtractionResult:
        """
        Extract structured data from OCR result.
        
        Args:
            ocr_result: OCR output with page markdown
            document_id: ID of source document
            
        Returns:
            ExtractionResult with canonical data and field extractions
        """
        start_time = time.time()
        
        # Prepare OCR text
        ocr_text = ocr_result.get_full_markdown()
        
        # Call OpenAI
        try:
            # Build API call parameters
            api_params = {
                "model": self.model,
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert at extracting structured data from electricity bills. Extract all relevant billing information and provide evidence for each field. Always respond with valid JSON."
                    },
                    {
                        "role": "user",
                        "content": f"Extract data from this electricity bill:\n\n{ocr_text}"
                    }
                ],
                "temperature": 0.1,
                "max_tokens": 4000
            }
            
            # Only add response_format for non-finetuned models
            # Fine-tuned models don't support response_format
            if not self.is_finetuned:
                api_params["response_format"] = {"type": "json_object"}
            
            response = await self.client.chat.completions.create(**api_params)
            
            raw_output = response.choices[0].message.content
            
            # Parse JSON from response (handle potential markdown code blocks)
            json_str = raw_output.strip()
            if json_str.startswith("```"):
                # Remove markdown code block if present
                lines = json_str.split("\n")
                json_str = "\n".join(lines[1:-1] if lines[-1] == "```" else lines[1:])
            
            extracted_data = json.loads(json_str)
            
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse extraction response as JSON: {str(e)}\nResponse: {raw_output[:500]}")
        except Exception as e:
            raise ValueError(f"Extraction failed: {str(e)}")
        
        processing_time = time.time() - start_time
        
        # Convert to canonical format
        canonical_data = self._to_canonical(extracted_data, document_id)
        fields = self._extract_fields(extracted_data, document_id)
        
        return ExtractionResult(
            canonical_data=canonical_data,
            fields=fields,
            processing_time=processing_time,
            model_name=self.model,
            raw_response=extracted_data
        )
    
    def _to_canonical(self, data: Dict, document_id: str) -> Dict[str, Any]:
        """Convert extracted data to canonical Osita JSON format."""
        # Normalize consumption to MWh
        total_consumption = data.get("total_consumption", {})
        consumption_value = total_consumption.get("value", 0)
        consumption_unit = total_consumption.get("unit", "kWh")
        normalized_mwh = self._normalize_to_mwh(consumption_value, consumption_unit)
        
        # Build canonical bill structure
        bill = {
            "document_id": document_id,
            "supplier": data.get("supplier"),
            "billing_period": data.get("billing_period"),
            "site_address": data.get("site_address"),
            "meter_ids": [m.get("meter_id") for m in data.get("meter_readings", []) if m.get("meter_id")],
            "line_items": data.get("line_items", []),
            "total_consumption": {
                "value": consumption_value,
                "unit": consumption_unit,
                "normalized_mwh": normalized_mwh
            },
            "total_amount": data.get("total_amount", {}).get("value"),
            "currency": data.get("total_amount", {}).get("currency")
        }
        
        return {
            "electricity_bills": [bill],
            "total_electricity_mwh": normalized_mwh,
            "extraction_version": "1.0",
            "last_updated": datetime.utcnow().isoformat()
        }
    
    def _extract_fields(self, data: Dict, document_id: str) -> List[Dict[str, Any]]:
        """Extract individual fields with evidence for review UI."""
        fields = []
        evidence_map = {e["field"]: e for e in data.get("evidence", [])}
        
        # Helper to create field entry
        def add_field(name: str, field_type: str, value: Any, unit: str = None):
            evidence = evidence_map.get(name, {})
            fields.append({
                "field_name": name,
                "field_type": field_type,
                "value": str(value) if value is not None else None,
                "unit": unit,
                "confidence": evidence.get("confidence", 0.5),
                "source_page": evidence.get("page"),
                "source_quote": evidence.get("quote"),
                "status": "unconfirmed"
            })
        
        # Extract key fields
        if data.get("supplier"):
            add_field("supplier", "supplier", data["supplier"])
        
        if data.get("billing_period"):
            bp = data["billing_period"]
            if bp.get("start_date"):
                add_field("period_start", "period_start", bp["start_date"])
            if bp.get("end_date"):
                add_field("period_end", "period_end", bp["end_date"])
        
        if data.get("site_address"):
            add_field("site_address", "site_address", data["site_address"])
        
        if data.get("total_consumption"):
            tc = data["total_consumption"]
            add_field("total_consumption", "total_consumption", tc.get("value"), tc.get("unit"))
        
        if data.get("total_amount"):
            ta = data["total_amount"]
            add_field("total_amount", "total_amount", ta.get("value"), ta.get("currency"))
        
        # Add meter readings
        for i, meter in enumerate(data.get("meter_readings", [])):
            if meter.get("meter_id"):
                add_field(f"meter_{i}_id", "meter_id", meter["meter_id"])
            if meter.get("consumption"):
                add_field(f"meter_{i}_consumption", "consumption", meter["consumption"], meter.get("unit"))
        
        return fields
    
    def _normalize_to_mwh(self, value: float, unit: str) -> float:
        """Convert consumption value to MWh."""
        if unit == "MWh":
            return value
        elif unit == "kWh":
            return value / 1000
        elif unit == "TJ":
            return value * 277.778  # 1 TJ = 277.778 MWh
        else:
            # Assume kWh if unknown
            return value / 1000


class MockExtractionService(ExtractionService):
    """Mock extraction service for testing."""
    
    async def extract_from_ocr(
        self, 
        ocr_result: OCRResult,
        document_id: str
    ) -> ExtractionResult:
        """Return mock extraction result."""
        mock_data = {
            "supplier": "Energy Corp",
            "account_number": "12345678",
            "billing_period": {
                "start_date": "2024-01-01",
                "end_date": "2024-01-31",
                "period_string": "January 2024"
            },
            "site_address": "123 Industrial Way, Manufacturing City",
            "meter_readings": [
                {"meter_id": "MTR-001", "consumption": 500, "unit": "kWh"},
                {"meter_id": "MTR-002", "consumption": 750, "unit": "kWh"}
            ],
            "total_consumption": {"value": 1250, "unit": "kWh"},
            "total_amount": {"value": 187.50, "currency": "EUR"},
            "evidence": [
                {"field": "supplier", "page": 1, "quote": "Energy Corp", "confidence": 0.95},
                {"field": "total_consumption", "page": 1, "quote": "Total Consumption: 1,250 kWh", "confidence": 0.9}
            ]
        }
        
        canonical_data = self._to_canonical(mock_data, document_id)
        fields = self._extract_fields(mock_data, document_id)
        
        return ExtractionResult(
            canonical_data=canonical_data,
            fields=fields,
            processing_time=0.5,
            model_name="mock-model",
            raw_response=mock_data
        )

