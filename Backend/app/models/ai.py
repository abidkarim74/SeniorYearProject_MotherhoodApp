from database.db import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column, Mapped
from uuid import UUID as u, uuid4
from sqlalchemy import ForeignKey


class AIChatbot(Base):
    __tablename__  = 'aibots'
    
    id: Mapped[u] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[u] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    