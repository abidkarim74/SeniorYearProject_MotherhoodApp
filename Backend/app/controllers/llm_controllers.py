from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException, Response
from sqlalchemy import text
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from sqlalchemy import select
import psutil
from uuid import UUID

from app.schemas.llm_schemas import AiConversationCreate, AiConversationUpdate
from app.models.ai import AiConversation

class LLMConversationControllers:
    @staticmethod
    async def create_llm_conversation(data: AiConversationCreate, user_id: UUID, db: AsyncSession):
        try:
            new_conversation = AiConversation(user_id=user_id, topic=data.topic)

            db.add(new_conversation)
            await db.commit()
            await db.refresh(new_conversation)

            return new_conversation

        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(status_code=error_dict.get('status_code', 500), detail=error_dict.get('detail', 'Internal server error!'))
    
    @staticmethod
    async def get_llm_conversation(conversation_id: UUID, user_id: UUID, db: AsyncSession):
        try:
            query = select(AiConversation).where(
                and_(
                    AiConversation.id == conversation_id,
                    AiConversation.user_id == user_id
                )
            )

            result = await db.execute(query)
            conversation = result.scalar_one_or_none()

            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")

            return conversation

        except SQLAlchemyError:
            raise HTTPException(status_code=500, detail="Database error!")
        
        except HTTPException:
            raise
            
        except Exception as e:
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get("status_code", 500),
                detail=error_dict.get("detail", "Internal server error!")
            )
    
    @staticmethod
    async def generate_conversation_summary(last_message: str) -> str:
        if len(last_message) > 50:
            return last_message[:50] + "..."
        return last_message
    
    @staticmethod
    async def update_llm_conversation(conversation_id: UUID, user_id: UUID, data: AiConversationUpdate, db: AsyncSession):
        try:
            query = select(AiConversation).where(
                and_(
                    AiConversation.id == conversation_id,
                    AiConversation.user_id == user_id
                )
            )
            
            print("Here 1")
            result = await db.execute(query)
            conversation = result.scalar_one_or_none()

            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")

            if data.last_message:
                if conversation.last_messages is None:
                    conversation.last_messages = []
                
                conversation.last_messages.append(data.last_message)
                
                if len(conversation.last_messages) > 10:
                    conversation.last_messages = conversation.last_messages[-10:]
                
                if not conversation.messages_exist:
                    conversation.messages_exist = True
                
                conversation.summary = await LLMConversationControllers.generate_conversation_summary(data.last_message)
            
            conversation.updated_at = datetime.utcnow()
            print("Here 2")
            await db.commit()
            await db.refresh(conversation)

            return conversation

        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail="Database error during update!")
        
        except HTTPException:
            raise
            
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get("status_code", 500),
                detail=error_dict.get("detail", "Internal server error during update!")
            )

    @staticmethod
    async def delete_llm_conversation(conversation_id: UUID, user_id: UUID, db: AsyncSession):
        try:
            query = select(AiConversation).where(
                and_(
                    AiConversation.id == conversation_id,
                    AiConversation.user_id == user_id
                )
            )

            result = await db.execute(query)
            conversation = result.scalar_one_or_none()

            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")

            await db.delete(conversation)
            await db.commit()

            return {"message": "Conversation deleted successfully"}

        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail="Database error!")

        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(
                status_code=error_dict.get("status_code", 500),
                detail=error_dict.get("detail", "Internal server error!")
            )
        


from app.schemas.llm_schemas import ChatbotMessageCreate
from app.models.ai import ChatbotMessage


class LLMMessageController():
    
    @staticmethod
    async def create_message(data: ChatbotMessageCreate, db: AsyncSession):
        try:
            conversation_query = select(AiConversation).where(
                AiConversation.id == data.conversation_id
            )
            
            conversation_result = await db.execute(conversation_query)
            conversation = conversation_result.scalar_one_or_none()
            
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")
            
            new_message = ChatbotMessage(
                content=data.content,
                conversation_id=data.conversation_id,
                message_type='ai'
            )
            
            db.add(new_message)
            await db.commit()
            await db.refresh(new_message)
            
            return new_message
            
        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail="Database error while creating message!")
        
        except HTTPException:
            raise
            
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get("status_code", 500),
                detail=error_dict.get("detail", "Internal server error while creating message!")
            )
    
    @staticmethod
    async def get_conversation_messages(conversation_id: UUID, user_id: UUID, db: AsyncSession):
        try:
            conversation_query = select(AiConversation).where(
                and_(
                    AiConversation.id == conversation_id,
                    AiConversation.user_id == user_id
                )
            )
            
            conversation_result = await db.execute(conversation_query)
            conversation = conversation_result.scalar_one_or_none()
            
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found")
            
            messages_query = select(ChatbotMessage).where(
                ChatbotMessage.conversation_id == conversation_id
            ).order_by(ChatbotMessage.created_at.asc())
            
            messages_result = await db.execute(messages_query)
            messages = messages_result.scalars().all()
            
            return messages
            
        except SQLAlchemyError:
            raise HTTPException(status_code=500, detail="Database error while fetching messages!")
        
        except HTTPException:
            raise
            
        except Exception as e:
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get("status_code", 500),
                detail=error_dict.get("detail", "Internal server error while fetching messages!")
            )