"""
API Routes
"""
from fastapi import APIRouter
from .projects import router as projects_router
from .documents import router as documents_router
from .extractions import router as extractions_router
from .exports import router as exports_router

api_router = APIRouter()

api_router.include_router(projects_router, prefix="/projects", tags=["Projects"])
api_router.include_router(documents_router, prefix="/documents", tags=["Documents"])
api_router.include_router(extractions_router, prefix="/extractions", tags=["Extractions"])
api_router.include_router(exports_router, prefix="/exports", tags=["Exports"])

