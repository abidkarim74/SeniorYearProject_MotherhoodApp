from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession

from llm_core.gemini_client import AdvancedGeminiClient
from llm_core.utils.gemini_utils import get_gemini_client
from schemas.ai_schemas import ChatMessage, ChatResponse
from middleware.protect_endpoints import verify_authentication
from database.postgres import connect_db
from schemas.ai_bot_schemas import (
    AIBotCreate, AIBotResponse,
    AiConversationCreate, AiConversationResponse, AiConversationUpdate,
    ChatbotMessageCreate, ChatbotMessageResponse,
    AiConversationWithMessages
)
from controllers.llm_controllers import LLMController


ai_chatbot_router = APIRouter(
    prefix='/api/ai-chatbot',
    tags=['AI Chatbot Routes']
)


@ai_chatbot_router.post('/bots', response_model=AIBotResponse)
async def create_ai_chatbot(
    data: AIBotCreate, 
    db: AsyncSession = Depends(connect_db), 
    payload = Depends(verify_authentication)
):
    return await LLMController.create_ai_chatbot(data, payload['id'], db)


@ai_chatbot_router.post('/get-user-bot', response_model=AIBotResponse)
async def create_ai_chatbot(
    data: AIBotCreate, 
    db: AsyncSession = Depends(connect_db), 
    payload = Depends(verify_authentication)
):
    return await LLMController.get_ai_chatbot(payload['id'], db)


@ai_chatbot_router.post('/conversations', response_model=AiConversationResponse)
async def create_conversation(
    data: AiConversationCreate,
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication)
):
    return await LLMController.create_conversation(data, payload['id'], db)


@ai_chatbot_router.get('/conversations/{conversation_id}', response_model=AiConversationWithMessages)
async def get_conversation_with_messages(
    conversation_id: UUID,
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication)
):
    conversation = await LLMController.get_conversation_with_messages(conversation_id, payload['id'], db)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@ai_chatbot_router.get('/conversations', response_model=List[AiConversationResponse])
async def get_user_conversations(
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication)
):
    return await LLMController.get_user_conversations(payload['id'], db)


@ai_chatbot_router.put('/conversations/{conversation_id}', response_model=AiConversationResponse)
async def update_conversation(
    conversation_id: UUID,
    data: AiConversationUpdate,
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication)
):
    conversation = await LLMController.update_conversation(conversation_id, payload['id'], data, db)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@ai_chatbot_router.delete('/conversations/{conversation_id}')
async def delete_conversation(
    conversation_id: UUID,
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication)
):
    success = await LLMController.delete_conversation(conversation_id, payload['id'], db)
    if not success:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return {"message": "Conversation deleted successfully"}


@ai_chatbot_router.post('/messages', response_model=ChatbotMessageResponse)
async def create_message(
    data: ChatbotMessageCreate,
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication)
):
    return await LLMController.create_message(data, payload['id'], db)