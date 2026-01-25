from fastapi import APIRouter, HTTPException, Depends
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession


from app.schemas.ai_schemas import AIChatMessage
from app.middleware.protect_endpoints import verify_authentication
from app.database.postgres import connect_db
from app.schemas.ai_bot_schemas import AIBotCreate, AIBotResponse
from app.controllers.llm_controllers import LLMController
from app.schemas.llm_schemas import AiConversationResponseSchema
from typing import List

from app.schemas.llm_schemas import AIMessageResponseSchema



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
    

@ai_chatbot_router.get('/detail', response_model=AIBotResponse)
async def create_ai_chatbot(db: AsyncSession = Depends(connect_db), payload = Depends(verify_authentication)):
    user_id = payload['id']
    
    if not user_id:
        raise HTTPException(status_code=401, detail='You are not authorized!')
    
    return await LLMController.get_ai_chatbot(user_id, db)




@ai_chatbot_router.post('/create-conversation', response_model=AiConversationResponseSchema)
async def create_ai_conversation(
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication)
):
    
    user_id = payload['id']
    
    if not user_id:
        raise HTTPException(status_code=401, detail='Not authorized!')
    
    return await LLMController.create_ai_conversation(user_id, db)
    

    
@ai_chatbot_router.get('/all-conversations', response_model=List[AiConversationResponseSchema])
async def create_ai_conversation(
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication)
):
    
    user_id = payload['id']
    
    if not user_id:
        raise HTTPException(status_code=401, detail='Not authorized!')
    
    return await LLMController.fetch_all_conversations(user_id, db)
    
    


from app.schemas.ai_schemas import AIConversationUpdate


@ai_chatbot_router.put('/update-conversation')
async def update_ai_conversation(
    data: AIConversationUpdate,
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication)
):
    user_id = payload['id']
    
    if not user_id:
        raise HTTPException(status_code=401, detail='Not authorized!')
    
    return await LLMController.update_conversation(data, db)


@ai_chatbot_router.put('/summarize-conversation/{conversation_id}')
async def update_ai_conversation(
    conversation_id: UUID,
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication)
):
    user_id = payload['id']
    
    if not user_id:
        raise HTTPException(status_code=401, detail='Not authorized!')
    
    return await LLMController.summarize_conversation(conversation_id, db)
    
    
@ai_chatbot_router.post("/chat")
async def chat_with_ai(
    message: AIChatMessage,
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication),
):
    if not message.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    user_id = payload['id']
    
    if not user_id:
        raise HTTPException(status_code=401, detail='Not authorized!')
    
    return await LLMController.chat_with_ai(user_id, message, db)






@ai_chatbot_router.get("/messages/{conversation_id}", response_model=List[AIMessageResponseSchema])
async def chatbot_message_list(
    conversation_id: UUID,
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication),
): 
    user_id = payload['id']
    
    if not user_id:
        raise HTTPException(status_code=401, detail='Not authorized!')
    
    return await LLMController.fetch_messages(conversation_id, db)



@ai_chatbot_router.delete("/delete-conversation/{conversation_id}")
async def delete_conversation(
    conversation_id: UUID,
    db: AsyncSession = Depends(connect_db),
    payload = Depends(verify_authentication),
): 
    user_id = payload['id']
    
    if not user_id:
        raise HTTPException(status_code=401, detail='Not authorized!')
    
    return await LLMController.delete_conversation(conversation_id, db)

