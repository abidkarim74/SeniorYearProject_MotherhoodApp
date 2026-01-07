import aiohttp # type: ignore
import asyncio
from schemas.ai_schemas import GeminiResponse
import time
import json


class AdvancedGeminiClient:
    def __init__(self, api_key: str, max_concurrent: int = 3, requests_per_minute: int = 10):
        self.api_key = api_key
        
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        
        self.semaphore = asyncio.Semaphore(max_concurrent)
        
        self.requests_per_minute = requests_per_minute
        self.last_request_time = 0
        
        self.available_models = []
        
        self.active_model = "gemini-2.0-flash" 
        
        
    async def test_model_connection(self, model_name: str) -> bool:
        url = f"{self.base_url}/{model_name}:generateContent?key={self.api_key}"
        
        test_payload = {
            "contents": [{
                "parts": [{
                    "text": "Say 'TEST'"
                }]
            }],
            "generationConfig": {
                "maxOutputTokens": 10
            }
        }
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    json=test_payload,
                    headers={'Content-Type': 'application/json'},
                    timeout=aiohttp.ClientTimeout(total=10)
                ) as response:           
                    if response.status == 200:
                        await response.json()
                        return True
                    
                    else:
                        error_text = await response.text()
                        
                        print(f"Model {model_name} failed: HTTP {response.status} - {error_text[:200]}")
                        
                        return False
                        
        except Exception as e:
            print(f"Model {model_name} error: {str(e)}")
            return False
    
    
    async def discover_working_model(self):
        models_to_test = [
            "gemini-2.0-flash",           
            "gemini-2.0-flash-001",       
            "gemini-pro-latest",          
            "gemini-2.5-flash",          
            "gemini-2.5-pro",             
        ]
        
        for model in models_to_test:
            if await self.test_model_connection(model):
                self.active_model = model
                return True
        
        return False
    
    
    async def _rate_limit(self):
        now = time.time()
        time_since_last = now - self.last_request_time
        
        min_interval = 60.0 / self.requests_per_minute
        
        if time_since_last < min_interval:
            await asyncio.sleep(min_interval - time_since_last)
        
        self.last_request_time = time.time()
        
    
    async def generate_with_retry(self, prompt: str, max_retries: int = 2) -> GeminiResponse:        
        url = f"{self.base_url}/{self.active_model}:generateContent?key={self.api_key}"
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "maxOutputTokens": 500,
            }
        }
        
        last_error = None
        
        for attempt in range(max_retries):
            try:
                await self._rate_limit()
            
                async with self.semaphore:
                    start_time = time.time()
                    
                    async with aiohttp.ClientSession() as session:
                        async with session.post(
                            url,
                            json=payload,
                            headers={
                                'Content-Type': 'application/json',
                                'User-Agent': 'NurturaAI/1.0'
                            },
                            timeout=aiohttp.ClientTimeout(total=15)
                        ) as response:
                            
                            response_text = await response.text()
                            latency = time.time() - start_time
                            
                            if response.status == 200:
                                data = json.loads(response_text)
                                
                                if "candidates" in data and data["candidates"]:
                                    text = data["candidates"][0]["content"]["parts"][0]["text"]

                                    return GeminiResponse(
                                        prompt=prompt,
                                        response_text=text.strip(),
                                        error=None,
                                        latency=latency
                                    )
                                else:
                                    last_error = "No candidates in response"
                                    print(f"{last_error}")
                                    
                            else:
                                error_msg = f"HTTP {response.status}"
                                try:
                                    error_data = json.loads(response_text)
                                    
                                    detailed_error = error_data.get("error", {})
                                    
                                    error_msg = f"HTTP {response.status}: {detailed_error.get('message', response_text[:200])}"
                                    
                                except:
                                    error_msg = f"HTTP {response.status}: {response_text[:200]}"
                                
                                last_error = error_msg
                                
                                if response.status in [400, 401, 403, 404]:
                                    break
                                    
                                if response.status == 429:  
                                    wait_time = 2 ** attempt
                                    print(f"Rate limited, waiting {wait_time}s...")
                                    await asyncio.sleep(wait_time)
                                    continue
                                
            except asyncio.TimeoutError:
                await asyncio.sleep(2 ** attempt)
                
            except aiohttp.ClientError as e:
                await asyncio.sleep(2 ** attempt)
                
            except Exception as e:
                await asyncio.sleep(2 ** attempt)
        
        return GeminiResponse(
            prompt=prompt,
            response_text=None,
            error=last_error or "Max retries exceeded",
            latency=0
        )
