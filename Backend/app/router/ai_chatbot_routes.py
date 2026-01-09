from fastapi import APIRouter, HTTPException, Depends
import aiohttp # type: ignore
import time
import os
from sqlalchemy import select
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from llm_core.gemini_client import AdvancedGeminiClient
from llm_core.utils.gemini_utils import get_gemini_client
from schemas.ai_schemas import ChatMessage, ChatResponse
from middleware.protect_endpoints import verify_authentication
from database.postgres import connect_db
from schemas.ai_bot_schemas import AIBotCreate, AIBotResponse
from controllers.llm_controllers import LLMController
from models.user import User


ai_chatbot_router = APIRouter(
    prefix='/api/ai-chatbot',
    tags=['AI Chatbot Routes']
)


@ai_chatbot_router.get('/exists')
async def bot_exists(db: AsyncSession = Depends(connect_db), payload = Depends(verify_authentication)):
    user_id = payload['id']
    
    if not user_id:
        raise HTTPException(status_code=401, detail='You are not authorized')
    
    return await LLMController.ai_chatbot_exits(user_id, db)


@ai_chatbot_router.post('/create-bot', status_code=201)
async def create_ai_chatbot(data: AIBotCreate, db: AsyncSession = Depends(connect_db), payload = Depends(verify_authentication)):
    return await LLMController.create_ai_chatbot(data, payload['id'], db)
    

@ai_chatbot_router.get('/{bot_id}', response_model=AIBotResponse)
async def create_ai_chatbot(bot_id: UUID,  db: AsyncSession = Depends(connect_db), payload = Depends(verify_authentication)):
    return await LLMController.get_ai_chatbot(bot_id, db)


@ai_chatbot_router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    message: ChatMessage,
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication),
    gemini_client: AdvancedGeminiClient = Depends(get_gemini_client)
):
    if not message.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        user_stmt = select(User).where(User.id == payload['id'])
        user_result = await db.execute(user_stmt)
        user = user_result.scalar_one_or_none()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
            
                
        personalized_prompt = f"""
        You are a helpful, knowledgeable, and compassionate parenting assistant named "ParentPal". 
        You are currently talking to {user.firstname}.
        
        Context about {user.firstname}:
        - They are a parent seeking advice and support
        - They may have questions about child care, development, health, or parenting challenges
        - They appreciate evidence-based information with a compassionate tone
        
        Important guidelines:
        1. Address them by name naturally in conversation when appropriate
        2. Provide supportive, evidence-based parenting advice
        3. Be compassionate and understanding of parenting challenges
        4. Suggest consulting healthcare professionals for medical concerns
        5. Maintain a warm, professional, and reassuring tone
        6. Keep responses clear and practical
        7. If you're unsure about something, acknowledge it and suggest reliable resources
        
        Current message from {user.username}: {message.message}
        
        Please provide a helpful response:
        """
        
        result = await gemini_client.generate_with_retry(personalized_prompt)
        
        if result.error:
            raise HTTPException(
                status_code=500, 
                detail=f"AI service error: {result.error}"
            )
            
        return ChatResponse(
            response=result.response_text,
            conversation_id=message.conversation_id,
            latency=round(result.latency, 2),
            error=None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        result = await gemini_client.generate_with_retry(message.message)
        
        if result.error:
            raise HTTPException(
                status_code=500, 
                detail=f"AI service error: {result.error}"
            )
            
        return ChatResponse(
            response=result.response_text,
            conversation_id=message.conversation_id,
            latency=round(result.latency, 2),
            error=None
        )
