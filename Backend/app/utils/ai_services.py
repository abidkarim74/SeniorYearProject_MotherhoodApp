from llm_core.utils.gemini_utils import get_gemini_client


async def generate_conversation_topic(message: str):
    client = await get_gemini_client()
    
    # print(client)
    
    return "Hello world"