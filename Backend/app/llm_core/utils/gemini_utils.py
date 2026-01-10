from fastapi import HTTPException
from llm_core.gemini_client import AdvancedGeminiClient
import os
from dotenv import load_dotenv # type: ignore


load_dotenv()


async def get_gemini_client():
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY environment variable not set")
    
    print(api_key)
    
    client = AdvancedGeminiClient(api_key="AIzaSyBkt5GUq9QL9BSlsDYEUmd4ggNipE_FDyE")
    
    if not await client.discover_working_model():
        raise HTTPException(
            status_code=503, 
            detail="Cannot connect to any Gemini models. Please check your API key and network connection."
        )
        
    return client