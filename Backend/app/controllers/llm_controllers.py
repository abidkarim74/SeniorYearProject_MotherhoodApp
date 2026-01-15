from uuid import UUID
from app.schemas.ai_bot_schemas import AIBotCreate
from app.schemas.llm_schemas import AiConversationUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from app.models.user import User
from app.models.ai import AIChatbot, AiConversation
from sqlalchemy import select
from app.utils.ai_services import generate_conversation_topic


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
            
        
    @staticmethod
    async def create_ai_conversation(user_id: UUID, db: AsyncSession):
        try:
            print("1---")
            topic = "New chat"
            conversation = AiConversation(user_id=user_id, topic=topic)
            
            db.add(conversation)
            
            
            await db.commit()
            
            print("2---")
            
            await db.refresh(conversation)
            
            print("3---")
            
            return conversation
        
        except SQLAlchemyError:
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
    async def update_conversation(data: AiConversationUpdate, db: AsyncSession):
        try:
            prompt = f"""
            Generate a concise topic (3-8 words) that summarizes the following message.
            Return only the topic, no quotes or extra text.

            Message:
            {data.message}
            """
            
            
            print("damn")
            topic =  await generate_conversation_topic(prompt)
            print(topic)
            
            
            
            conversation = await db.get(AiConversation, data.con_id)
            
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found!")
            
            conversation.topic = topic
            
            await db.commit()
            await db.refresh(conversation)
            
            return conversation.topic    
            
        except SQLAlchemyError:
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
    async def fetch_all_conversations(user_id: UUID, db: AsyncSession):
        try:
            result = await db.execute(
                select(AiConversation)
                .where(AiConversation.user_id == user_id)
                .order_by(AiConversation.updated_at.desc())
            )   
            conversations = result.scalars().all()
            
            return conversations
            
        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__
            
            raise HTTPException(
                status_code=error_dict.get('status_code', 500),
                detail=error_dict.get('detail', 'Internal server error!')
            )
            
            