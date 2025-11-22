from fastapi import APIRouter, HTTPException, Depends
import aiohttp # type: ignore
import time
import os
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from llm_core.gemini_client import AdvancedGeminiClient
from llm_core.utils.gemini_utils import get_gemini_client
from schemas.ai_schemas import ChatMessage, ChatResponse
from middleware.protect_endpoints import verify_authentication
from database.postgres import connect_db
from schemas.ai_bot_schemas import AIBotCreate, AIBotResponse
from controllers.llm_controllers import LLMController


ai_chatbot_router = APIRouter(
    prefix='/api/ai-chatbot',
    tags=['AI Chatbot Routes']
)


@ai_chatbot_router.post('/create-bot', status_code=201)
async def create_ai_chatbot(data: AIBotCreate, db: AsyncSession = Depends(connect_db), payload = Depends(verify_authentication)):
    return await LLMController.create_ai_chatbot(data, payload['id'], db)
    

@ai_chatbot_router.get('/{bot_id}', response_model=AIBotResponse)
async def create_ai_chatbot(bot_id: UUID,  db: AsyncSession = Depends(connect_db), payload = Depends(verify_authentication)):
    return await LLMController.get_ai_chatbot(bot_id, db)


@ai_chatbot_router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    message: ChatMessage,
    gemini_client: AdvancedGeminiClient = Depends(get_gemini_client)
):
    if not message.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
        
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

