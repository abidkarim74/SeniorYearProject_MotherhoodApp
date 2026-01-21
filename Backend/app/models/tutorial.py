from app.database.postgres import Base
from uuid import UUID as u, uuid4
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy import ForeignKey, text
from datetime import datetime
from sqlalchemy import DateTime, String, Boolean, Enum as E
from typing import List
from enum import Enum


class VideoTutorial(Base):
    __tablename__ = 'video_tutorials'
    
    id: Mapped[u] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    url: Mapped[u] = mapped_column(String, nullable=False)
    name: Mapped[u] = mapped_column(String, nullable=False)
    category: Mapped[u] = mapped_column(String)

