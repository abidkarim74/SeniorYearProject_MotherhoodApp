from app.database.postgres import Base
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import mapped_column, Mapped
from uuid import UUID as u, uuid4
from sqlalchemy import ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy import String
from sqlalchemy import Enum, DateTime
from typing import List
from enum import Enum as PyEnum
from datetime import datetime
from sqlalchemy import text



class AiConversation(Base):
    __tablename__ = "ai_conversations"

    id: Mapped[UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[u] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    topic: Mapped[str] = mapped_column(String, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        server_default=text('now()'),
        nullable=False
    )
    

    last_messages: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=True)

    summary: Mapped[str] = mapped_column(String, nullable=True)


class AIChatbot(Base):
    __tablename__  = 'aibots'
    
    id: Mapped[u] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id: Mapped[u] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str] = mapped_column(String, nullable=True)
    
    




class MessageType(PyEnum):
    HUMAN = "human"
    AI = "ai"
    SYSTEM = "system"


class ChatbotMessage(Base):
    __tablename__ = 'chatbot_messages'

    id: Mapped[u] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    chatbot_id: Mapped[u] = mapped_column(UUID(as_uuid=True), ForeignKey('aibots.id'), nullable=False, index=True)
    conversation_id: Mapped[u] = mapped_column(UUID(as_uuid=True), ForeignKey('ai_conversations.id'), nullable=False, index=True)
    user_id: Mapped[u] = mapped_column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False, index=True)
    
    message_type: Mapped[MessageType] = mapped_column(Enum(MessageType), nullable=False)
    content: Mapped[str] = mapped_column(String, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        server_default=text('now()'),
        nullable=False
    )
    
    