import json


def validate_sql_agent_output(model_output: str):
    print(model_output)
    allowed_tables = {"children", "allergies", "sleep_schedules", "medical_conditions"}
    
    try:
        data = json.loads(model_output)

        query = data.get("query")
        tables = data.get("tables_used", [])
        confidence = data.get("confidence", 0)

        if not set(tables).issubset(allowed_tables):
            return False, None

        if not query or not query.strip().lower().startswith("select"):
            return False, None

        if confidence < 0.4:
            return False, None

        return True, query

    except Exception:
        return False, None
