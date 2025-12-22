"""
OCR Service - Mistral AI Integration
Handles PDF to Markdown conversion using Mistral OCR.
"""
import httpx
import base64
import json
import time
from pathlib import Path
from typing import Optional, Dict, Any, List
from datetime import datetime

from ..config import get_settings


class OCRPage:
    """Represents a single page of OCR output."""
    def __init__(self, page_number: int, markdown: str, language: Optional[str] = None):
        self.page_number = page_number
        self.markdown = markdown
        self.language = language


class OCRResult:
    """Result from OCR processing."""
    def __init__(
        self,
        pages: List[OCRPage],
        page_count: int,
        detected_language: str = "unknown",
        processing_time: float = 0.0,
        confidence: float = 0.0,
        raw_response: Optional[Dict] = None
    ):
        self.pages = pages
        self.page_count = page_count
        self.detected_language = detected_language
        self.processing_time = processing_time
        self.confidence = confidence
        self.raw_response = raw_response
    
    def get_full_markdown(self) -> str:
        """Get all pages concatenated as markdown."""
        return "\n\n---\n\n".join([f"## Page {p.page_number}\n\n{p.markdown}" for p in self.pages])
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary for storage."""
        return {
            "pages": [
                {
                    "page_number": p.page_number,
                    "markdown": p.markdown,
                    "language": p.language
                }
                for p in self.pages
            ],
            "page_count": self.page_count,
            "detected_language": self.detected_language,
            "processing_time": self.processing_time,
            "confidence": self.confidence,
            "processed_at": datetime.utcnow().isoformat()
        }


class OCRService:
    """
    Service for processing PDFs with Mistral OCR.
    Converts PDFs to structured markdown per page.
    """
    
    MISTRAL_OCR_ENDPOINT = "https://api.mistral.ai/v1/ocr"
    
    def __init__(self):
        self.settings = get_settings()
        self.api_key = self.settings.mistral_api_key
    
    async def process_pdf(self, pdf_path: str, max_retries: int = 3) -> OCRResult:
        """
        Process a PDF file and extract text using Mistral OCR.
        
        Args:
            pdf_path: Path to the PDF file
            max_retries: Number of retries for network errors
            
        Returns:
            OCRResult with extracted text and metadata
        """
        import asyncio
        
        start_time = time.time()
        
        # Read and encode PDF
        pdf_file = Path(pdf_path)
        if not pdf_file.exists():
            raise FileNotFoundError(f"PDF file not found: {pdf_path}")
        
        with open(pdf_file, "rb") as f:
            pdf_bytes = f.read()
        
        pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")
        
        # Configure timeout with longer read timeout for large files
        timeout_config = httpx.Timeout(
            connect=30.0,
            read=180.0,  # 3 minutes for reading response
            write=60.0,
            pool=30.0
        )
        
        last_error = None
        
        # Retry loop for transient network errors
        for attempt in range(max_retries):
            async with httpx.AsyncClient(timeout=timeout_config) as client:
                try:
                    response = await client.post(
                        self.MISTRAL_OCR_ENDPOINT,
                        headers={
                            "Authorization": f"Bearer {self.api_key}",
                            "Content-Type": "application/json"
                        },
                        json={
                            "model": "mistral-ocr-latest",
                            "document": {
                                "type": "document_url",
                                "document_url": f"data:application/pdf;base64,{pdf_base64}"
                            },
                            "include_image_base64": False
                        }
                    )
                    response.raise_for_status()
                    result = response.json()
                    break  # Success, exit retry loop
                    
                except httpx.HTTPStatusError as e:
                    if e.response.status_code == 401:
                        raise ValueError("Invalid Mistral API key")
                    elif e.response.status_code == 429:
                        raise ValueError("Mistral API rate limit exceeded")
                    else:
                        raise ValueError(f"Mistral OCR API error: {e.response.text}")
                except httpx.TimeoutException:
                    raise TimeoutError("OCR processing timed out")
                except (httpx.ReadError, httpx.ConnectError, httpx.RemoteProtocolError) as e:
                    # Network errors - retry with exponential backoff
                    last_error = e
                    if attempt < max_retries - 1:
                        wait_time = 2 ** attempt  # 1s, 2s, 4s
                        print(f"[OCR] Network error, retrying in {wait_time}s (attempt {attempt + 1}/{max_retries})")
                        await asyncio.sleep(wait_time)
                        continue
                    else:
                        raise ValueError(f"OCR failed after {max_retries} attempts: network error - {str(e)}")
        else:
            # All retries exhausted
            raise ValueError(f"OCR failed after {max_retries} attempts: {str(last_error)}")
        
        processing_time = time.time() - start_time
        
        # Parse response
        pages = self._parse_ocr_response(result)
        detected_language = self._detect_language(pages)
        confidence = self._calculate_confidence(result)
        
        return OCRResult(
            pages=pages,
            page_count=len(pages),
            detected_language=detected_language,
            processing_time=processing_time,
            confidence=confidence,
            raw_response=result
        )
    
    def _parse_ocr_response(self, response: Dict) -> List[OCRPage]:
        """Parse Mistral OCR response into page objects."""
        pages = []
        
        # Handle the response structure from Mistral
        if "pages" in response:
            for idx, page_data in enumerate(response["pages"], start=1):
                markdown = page_data.get("markdown", "")
                pages.append(OCRPage(
                    page_number=idx,
                    markdown=markdown
                ))
        elif "content" in response:
            # Single page or different format
            pages.append(OCRPage(
                page_number=1,
                markdown=response["content"]
            ))
        
        return pages
    
    def _detect_language(self, pages: List[OCRPage]) -> str:
        """
        Detect primary language from OCR output.
        Simple heuristic based on character analysis.
        """
        all_text = " ".join([p.markdown for p in pages])
        
        # Check for Arabic (RTL characters)
        arabic_chars = sum(1 for c in all_text if '\u0600' <= c <= '\u06FF')
        # Check for French (accented characters)
        french_chars = sum(1 for c in all_text if c in 'éèêëàâäùûüôöîïç')
        
        total_chars = len(all_text.replace(" ", ""))
        if total_chars == 0:
            return "unknown"
        
        arabic_ratio = arabic_chars / total_chars
        french_ratio = french_chars / total_chars
        
        if arabic_ratio > 0.2:
            return "ar"
        elif french_ratio > 0.02:
            return "fr"
        else:
            return "en"
    
    def _calculate_confidence(self, response: Dict) -> float:
        """
        Calculate overall OCR confidence.
        Returns value between 0 and 1.
        """
        # If Mistral provides confidence, use it
        if "confidence" in response:
            return response["confidence"]
        
        # Otherwise estimate based on page content
        if "pages" in response:
            total_chars = sum(
                len(p.get("markdown", "")) 
                for p in response["pages"]
            )
            # Assume good confidence if we got substantial text
            if total_chars > 100:
                return 0.85
            elif total_chars > 20:
                return 0.6
            else:
                return 0.3
        
        return 0.5  # Default mid-range confidence


class MockOCRService(OCRService):
    """
    Mock OCR service for testing without API calls.
    """
    
    async def process_pdf(self, pdf_path: str) -> OCRResult:
        """Return mock OCR result."""
        return OCRResult(
            pages=[
                OCRPage(
                    page_number=1,
                    markdown="""# Electricity Bill
                    
**Supplier:** Energy Corp
**Account Number:** 12345678

## Billing Period
From: January 1, 2024
To: January 31, 2024

## Consumption Details
| Meter ID | Reading Start | Reading End | Consumption |
|----------|---------------|-------------|-------------|
| MTR-001  | 10000 kWh    | 10500 kWh  | 500 kWh    |
| MTR-002  | 25000 kWh    | 25750 kWh  | 750 kWh    |

## Total
**Total Consumption:** 1,250 kWh (1.25 MWh)
**Total Amount:** €187.50

Thank you for your business.
"""
                )
            ],
            page_count=1,
            detected_language="en",
            processing_time=0.1,
            confidence=0.95
        )

