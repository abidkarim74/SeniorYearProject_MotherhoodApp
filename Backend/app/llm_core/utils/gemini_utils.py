from fastapi import HTTPException
from llm_core.gemini_client import AdvancedGeminiClient
import os
from dotenv import load_dotenv

load_dotenv()

_gemini_client = None

async def get_gemini_client() -> AdvancedGeminiClient:
    global _gemini_client
    
    if _gemini_client is not None:
        return _gemini_client
    
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set")
    
    try:
        client = AdvancedGeminiClient(
            api_key=api_key,
            max_concurrent=2,
            requests_per_minute=15
        )
        
        available_models = await client.quick_health_check()
        
        if not available_models:
            print("All models appear unavailable based on initial state")
        
        _gemini_client = client
        return _gemini_client
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to initialize Gemini client: {str(e)}"
        )