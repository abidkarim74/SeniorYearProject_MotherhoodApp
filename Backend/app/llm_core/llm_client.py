import aiohttp
import asyncio


class OllamaClient:

    def __init__(
        self,
        model: str = "qwen2.5:3b",
        temperature: float = 0.1,
        top_p: float = 0.9,
        num_predict: int = 150,
        keep_alive: str = "10m"
    ):
        self.model = model
        self.temperature = temperature
        self.top_p = top_p
        self.num_predict = num_predict
        self.keep_alive = keep_alive
        self.url = "http://localhost:11434/api/chat"

        self.session = aiohttp.ClientSession()

    async def chat(self, messages: list, temperature: float | None = None) -> str:
        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "format": "json",
            "keep_alive": self.keep_alive,
            "options": {
                "temperature": temperature or self.temperature,
                "top_p": self.top_p,
                "num_predict": self.num_predict
            }
        }

        async with self.session.post(self.url, json=payload) as response:
            response.raise_for_status()
            data = await response.json()
            return data["message"]["content"]

    async def close(self):
        await self.session.close()
