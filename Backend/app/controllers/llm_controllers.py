from uuid import UUID
from schemas.ai_bot_schemas import (
    AIBotCreate, 
    AiConversationCreate, 
    AiConversationUpdate,
    ChatbotMessageCreate
)
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import select
from fastapi import HTTPException
from models.user import User
from models.ai import AIChatbot, AiConversation, ChatbotMessage


class LLMController():
    @staticmethod
    async def create_ai_chatbot(data: AIBotCreate, auth_id: UUID, db: AsyncSession):
        try:
            user = await db.get(User, auth_id)
            
            if not user:
                raise HTTPException(status_code=401, detail='You are not authorized!')
            
            new_bot = AIChatbot(user_id=auth_id, name=data.name, description=data.description)
            
            db.add(new_bot)
            await db.commit()
            
            await db.refresh(new_bot)
            
            return new_bot
        
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            ) 
         
         
    @staticmethod   
    async def get_ai_chatbot(bot_id: UUID, db: AsyncSession):
        try:
            bot = await db.get(AIChatbot, bot_id)
            
            if not bot:
                raise HTTPException(status_code=404, detail='AI Chatbot not found')
            
            return bot
        
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            ) 


    @staticmethod
    async def create_conversation(data: AiConversationCreate, auth_id: UUID, db: AsyncSession):
        try:
            user = await db.get(User, auth_id)
            if not user:
                raise HTTPException(status_code=401, detail='You are not authorized!')

            new_conversation = AiConversation(
                user_id=auth_id,
                topic=data.topic,
                last_messages=data.last_messages,
                summary=data.summary
            )
            
            db.add(new_conversation)
            await db.commit()
            await db.refresh(new_conversation)
            
            return new_conversation
            
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )

    @staticmethod
    async def get_conversation_with_messages(conversation_id: UUID, auth_id: UUID, db: AsyncSession):
        try:
            stmt = select(AiConversation).where(
                AiConversation.id == conversation_id,
                AiConversation.user_id == auth_id
            )
            result = await db.execute(stmt)
            conversation = result.scalar_one_or_none()
            
            if not conversation:
                raise HTTPException(status_code=404, detail='Conversation not found')
            
            messages_stmt = select(ChatbotMessage).where(
                ChatbotMessage.conversation_id == conversation_id
            ).order_by(ChatbotMessage.created_at)
            messages_result = await db.execute(messages_stmt)
            messages = messages_result.scalars().all()
            
            conversation.messages = messages
            
            return conversation
            
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )

    @staticmethod
    async def get_user_conversations(auth_id: UUID, db: AsyncSession):
        try:
            stmt = select(AiConversation).where(
                AiConversation.user_id == auth_id
            ).order_by(AiConversation.created_at.desc())
            
            result = await db.execute(stmt)
            conversations = result.scalars().all()
            
            return conversations
            
        except SQLAlchemyError as e:
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )

    @staticmethod
    async def update_conversation(conversation_id: UUID, auth_id: UUID, data: AiConversationUpdate, db: AsyncSession):
        try:
            stmt = select(AiConversation).where(
                AiConversation.id == conversation_id,
                AiConversation.user_id == auth_id
            )
            result = await db.execute(stmt)
            conversation = result.scalar_one_or_none()
            
            if not conversation:
                raise HTTPException(status_code=404, detail='Conversation not found')
            
            update_data = data.model_dump(exclude_unset=True)
            for field, value in update_data.items():
                setattr(conversation, field, value)
            
            await db.commit()
            await db.refresh(conversation)
            
            return conversation
            
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )

    @staticmethod
    async def delete_conversation(conversation_id: UUID, auth_id: UUID, db: AsyncSession):
        try:
            stmt = select(AiConversation).where(
                AiConversation.id == conversation_id,
                AiConversation.user_id == auth_id
            )
            result = await db.execute(stmt)
            conversation = result.scalar_one_or_none()
            
            if not conversation:
                raise HTTPException(status_code=404, detail='Conversation not found')
            
            messages_stmt = select(ChatbotMessage).where(
                ChatbotMessage.conversation_id == conversation_id
            )
            messages_result = await db.execute(messages_stmt)
            messages = messages_result.scalars().all()
            
            for message in messages:
                await db.delete(message)
            
            await db.delete(conversation)
            await db.commit()
            
            return True
            
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )

    @staticmethod
    async def create_message(data: ChatbotMessageCreate, auth_id: UUID, db: AsyncSession):
        try:
            conversation_stmt = select(AiConversation).where(
                AiConversation.id == data.conversation_id,
                AiConversation.user_id == auth_id
            )
            conversation_result = await db.execute(conversation_stmt)
            conversation = conversation_result.scalar_one_or_none()
            
            if not conversation:
                raise HTTPException(status_code=404, detail='Conversation not found')
            
            bot_stmt = select(AIChatbot).where(
                AIChatbot.id == data.chatbot_id,
                AIChatbot.user_id == auth_id
            )
            bot_result = await db.execute(bot_stmt)
            bot = bot_result.scalar_one_or_none()
            
            if not bot:
                raise HTTPException(status_code=404, detail='AI Bot not found')
            
            new_message = ChatbotMessage(
                chatbot_id=data.chatbot_id,
                conversation_id=data.conversation_id,
                user_id=auth_id,
                message_type=data.message_type,
                content=data.content,
                tokens_used=data.tokens_used,
                metadata=data.metadata
            )
            
            db.add(new_message)
            await db.commit()
            await db.refresh(new_message)
            
            return new_message
            
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )