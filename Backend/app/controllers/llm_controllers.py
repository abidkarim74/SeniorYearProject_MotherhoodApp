from uuid import UUID
from app.schemas.ai_bot_schemas import AIBotCreate
from app.schemas.llm_schemas import AiConversationUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import SQLAlchemyError
from fastapi import HTTPException
from app.models.user import User
from app.models.ai import AIChatbot, AiConversation, ChatbotMessage
from sqlalchemy import select
from app.utils.ollama_utlls import generate_conversation_topic, summerize_conversation, chat_with_user
from app.schemas.ai_schemas import AIChatMessage, AiMessageType, AIConversationUpdate, AiGenerateMessageSchema
from app.models.ai import MessageType



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
            topic = "New chat"
            conversation = AiConversation(user_id=user_id, topic=topic)
            
            db.add(conversation)
            
            await db.commit()
                        
            await db.refresh(conversation)
                        
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
    async def update_conversation(data: AIConversationUpdate, db: AsyncSession):
        try:
            prompt = f"""
            Generate a concise topic (3-8 words) that summarizes the following message.
            Return only the topic, no quotes or extra text.

            Message:
            {data.message}
            """
            
            conversation = await db.get(AiConversation, data.conversation_id)
            
            if not conversation:
                raise HTTPException(status_code=404, detail="Conversation not found!")
            
            topic =  await generate_conversation_topic(prompt)
            
            if not conversation.messages_exist:
                conversation.topic = topic
                conversation.messages_exist = True
        
                await db.commit()
                await db.refresh(conversation)
                
                return conversation.topic   
            else:
                return None 
            
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
            

    @staticmethod
    async def summarize_conversation(conversation_id: UUID, db: AsyncSession):
        try:
            conversation = await db.get(AiConversation, conversation_id)

            if not conversation:
                raise HTTPException(status_code=404, detail='Conversation not found!')
            
            if conversation.last_messages == None:
                conversation.last_messages = []

            print(conversation.topic);

            print(conversation.last_messages)

            summary = await summerize_conversation({'topic': conversation.topic, 'last_messages': conversation.last_messages})

            conversation.summary = summary;

            await db.commit()
            await db.refresh(conversation)

            print(summary)

            return True            

        except SQLAlchemyError:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            error_dict = e.__dict__

            raise HTTPException(status_code=error_dict.get('status_code', 500), detail=error_dict.get('detail', 'Internal server error!'))
        

    @staticmethod
    async def chat_with_ai(user_id: UUID, chat_message: AIChatMessage, db: AsyncSession):
        try:
            conversation = await db.get(AiConversation, chat_message.conversation_id)

            if not conversation:
                raise HTTPException(status_code=404, detail='Conversation not found!')
            
            if conversation.last_messages is None:
                conversation.last_messages = []
            
            
            conversation.last_messages.append(chat_message.message)

            if len(conversation.last_messages) > 3:
                conversation.last_messages = conversation.last_messages[-3:]
            
            await db.commit()
            await db.refresh(conversation)
            
            new_user_message = ChatbotMessage(
                user_id=user_id,
                conversation_id=chat_message.conversation_id,
                content=chat_message.message,
                message_type=MessageType.HUMAN
            )
            
            db.add(new_user_message)
            await db.commit()

            data = AiGenerateMessageSchema(
                summary=conversation.summary,
                user_fullname=chat_message.user_fullname,
                last_messages=conversation.last_messages
            )
            
            ai_response = await chat_with_user(data)
            
            new_bot_message = ChatbotMessage(
                user_id=user_id,
                conversation_id=chat_message.conversation_id,
                content=ai_response,
                message_type=MessageType.AI
            )
            db.add(new_bot_message)
           
            await db.commit()
            
            return ai_response
            
    
        except SQLAlchemyError as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.rollback()
            raise HTTPException(status_code=500, detail='Internal server error!')
        

    @staticmethod
    async def fetch_messages(conversation_id: UUID, db: AsyncSession):
        try:
            stmt = (
                select(ChatbotMessage)
                .where(ChatbotMessage.conversation_id == conversation_id)
                .order_by(ChatbotMessage.created_at.asc())
            )
            result = await db.execute(stmt)

            messages = result.scalars().all()

            return messages

        except SQLAlchemyError:
            await db.close()

            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.close()

            error_dict = e.__dict__

            raise HTTPException(status_code=error_dict.get('status_code', 500), detail=error_dict.get('detail', 'Internal server error!'))
        


    @staticmethod
    async def delete_conversation(conversation_id: UUID, db: AsyncSession):
        try:
            conversation = await db.get(AiConversation, conversation_id)

            if not conversation:
                raise HTTPException(status_code=404, detail='Conversation not found!')
            
            await db.delete(conversation)
            await db.commit()

            return True
            
        except SQLAlchemyError:
            await db.close()

            raise HTTPException(status_code=500, detail='Database error!')
        
        except Exception as e:
            await db.close()

            error_dict = e.__dict__

            raise HTTPException(status_code=error_dict.get('status_code', 500), detail=error_dict.get('detail', 'Internal server error!'))