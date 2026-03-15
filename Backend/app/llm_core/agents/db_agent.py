from app.utils.validate_agents_response import validate_sql_agent_output

from app.schemas.llm_schemas import AIChatOption

from app.utils.ai_prompt_generate import generate_allergy_prompt, generate_child_medical_prompt



class DatabaseAgent:

    def __init__(self, llm_client):
        self.llm = llm_client

    async def generate_query(self, mother_question: str, mother_id: str, query_type: AIChatOption):

        if query_type.value == 'child_medical':
            messages = [
                {"role": "system", "content": generate_child_medical_prompt(mother_id)},
                {"role": "user", "content": mother_question}
            ]
        elif query_type.value == 'child_allergy':
            messages = [
                {"role": "system", "content": generate_allergy_prompt(mother_id)},
                {"role": "user", "content": mother_question}
            ]
        else:
            return None

        try:
            response = await self.llm.chat(messages)

        except Exception as e:
            return None

        print(response)

        valid, query = validate_sql_agent_output(response)

        if not valid:
            return None

        query = query.replace(":mother_id", f"'{mother_id}'")

        return query


    async def close(self):
        await self.session.close()