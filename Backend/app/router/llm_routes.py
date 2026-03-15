from fastapi import APIRouter, Depends, HTTPException
from app.schemas.llm_schemas import UserPrompt, AIChatOption
from app.middleware.protect_endpoints import verify_authentication
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.postgres import connect_db

from app.llm_core.utils.agents_response import generate_agent_response


llm_router = APIRouter(prefix='/api/llm')


@llm_router.post('/chat', status_code=201)
async def generate_ai_response(data: UserPrompt, db: AsyncSession = Depends(connect_db), payload = Depends(verify_authentication)):
    user_id = payload['id']

    if not user_id:
        raise HTTPException(status_code=401, detail='Unauthorized request!')
    
    response = await generate_agent_response(data.conv_type, data.prompt, user_id)
    
    return response       

