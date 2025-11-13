from database.db import Base
from sqlalchemy.orm import Mapped, mapped_column
from uuid import UUID as u, uuid4
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy import String, Integer, DateTime, ForeignKey, Date
from datetime import datetime
from typing import List
from enum import Enum as PyEnum
from sqlalchemy import Enum as SAEnum


class GenderEnum(PyEnum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"
    

class Child(Base):
    __tablename__ = 'children'
    
    id: Mapped[u] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    firstname: Mapped[str] = mapped_column(String, nullable=False)
    lastname: Mapped[str] = mapped_column(String, nullable=True)
    profile_pic: Mapped[str | None] = mapped_column(String, nullable=True)

    
    mother_id: Mapped[u] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)

    
    gender: Mapped[GenderEnum | None] = mapped_column(
        SAEnum(GenderEnum, name="gender_enum"),  
        nullable=True
    )    
    date_of_birth: Mapped[datetime | None] = mapped_column(nullable=True, default=datetime.now)

    blood_type: Mapped[str | None] = mapped_column(String, nullable=True)
    pictures: Mapped[List[str] | None] = mapped_column(JSON, nullable=True)

    
    height: Mapped[float | None] = mapped_column(nullable=True)
    weight: Mapped[float | None] = mapped_column(nullable=True)
    
    head_circumference: Mapped[float | None] = mapped_column(nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Need separate models for scalabilty
    """
    
    sleep_schedule: Mapped[str | None] = mapped_column(String, nullable=True)
    
    # allergies: Mapped[str | None] = mapped_column(String, nullable=True)
    
    # medical_conditions: Mapped[str | None] = mapped_column(String, nullable=True)
    """



