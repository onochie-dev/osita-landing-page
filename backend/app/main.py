"""
Osita CBAM Filing Engine - Main Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from .config import get_settings
from .database import init_db
from .api import api_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    init_db()
    
    # Create upload directory
    os.makedirs(settings.upload_dir, exist_ok=True)
    
    yield
    
    # Shutdown
    pass


app = FastAPI(
    title="Osita CBAM Filing Engine",
    description="""
    CBAM filing engine for indirect emissions (electricity only).
    
    Features:
    - Upload energy bill PDFs
    - OCR processing with Mistral AI
    - Structured extraction with OpenAI
    - Validation and review
    - Export to Excel and XML
    """,
    version="0.1.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "name": "Osita CBAM Filing Engine",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}

