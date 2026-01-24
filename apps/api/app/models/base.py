"""
Base SQLAlchemy Model Configuration
"""
from sqlalchemy import Column, DateTime, String, func
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime
import uuid


def generate_uuid() -> str:
    """Generate a unique UUID string."""
    return str(uuid.uuid4())


class Base(DeclarativeBase):
    """Base class for all database models."""
    pass


class TimestampMixin:
    """Mixin that adds created_at and updated_at columns."""
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

