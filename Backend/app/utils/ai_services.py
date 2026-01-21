from app.llm_core.utils.gemini_utils import get_gemini_client


async def generate_conversation_topic(message: str):
    print("a")
    client = await get_gemini_client()
    
    print("b")
    
    response = await client.generate_with_retry(message)
    
    print(f"Response: {response.response_text}")
    print("hi")
    
    
    return response.response_text