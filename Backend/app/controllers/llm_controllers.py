from uuid import UUID
from schemas.ai_bot_schemas import AIBotCreate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from models.user import User
from models.ai import AIChatbot


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
    async def get_ai_chatbot(bot_id: UUID,  db: AsyncSession):
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
        
    