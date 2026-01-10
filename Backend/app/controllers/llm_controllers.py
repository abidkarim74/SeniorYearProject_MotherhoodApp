from uuid import UUID
from schemas.ai_bot_schemas import AIBotCreate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from models.user import User
from models.ai import AIChatbot
from sqlalchemy import select


class LLMController():
    @staticmethod
    async def ai_chatbot_exits(user_id: UUID, db: AsyncSession):
        try:
            existing_bot_query = select(AIChatbot).where(AIChatbot.user_id==user_id)
            
            existing_bot_result = await db.execute(existing_bot_query)
            
            existing_bot = existing_bot_result.scalars().first()  
                
            if existing_bot:
                return True
            else:
                return False
        
        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(status_code=error_dict.get('status_code', 500), detail=error_dict.get('detail', 'Internal server error!'))
        
        
    @staticmethod  
    async def create_ai_chatbot(data: AIBotCreate, auth_id: UUID, db: AsyncSession):
        try:
            user = await db.get(User, auth_id)
            
            if not user:
                raise HTTPException(status_code=401, detail='You are not authorized!')
            
            existing_bot_query = select(AIChatbot).where(AIChatbot.user_id==auth_id)
            
            existing_bot_result = await db.execute(existing_bot_query)
                        
            existing_bot = existing_bot_result.scalars().first()            
            
            if existing_bot:
                raise HTTPException(
                    status_code=409,  
                    detail=f'A bot already exists for this user'
                )
                
            new_bot = AIChatbot(user_id=auth_id, name=f'{user.firstname.title()} Parenting Assistent', description=data.description)
            
            db.add(new_bot)
            await db.commit()
            
            await db.refresh(new_bot)
            
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
    async def get_ai_chatbot(user_id: UUID,  db: AsyncSession):
        try:
            statement = select(AIChatbot).where(AIChatbot.user_id==user_id)
            
            result = await db.execute(statement)
            
            bot = result.scalars().first()
            
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
        
    
    async def create_ai_conversation(user_id: UUID, db: AsyncSession):
        pass