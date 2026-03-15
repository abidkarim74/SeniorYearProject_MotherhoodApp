from app.llm_core.llm_client import OllamaClient
from app.llm_core.agents.db_agent import DatabaseAgent
from app.schemas.llm_schemas import AIChatOption



async def generate_agent_response(agent_type: str, prompt: str, mother_id: str):
    ollama_client = OllamaClient()
    database_agent = DatabaseAgent(ollama_client)

    response = await database_agent.generate_query(prompt, mother_id, agent_type) 

    await ollama_client.close()

    return response
    