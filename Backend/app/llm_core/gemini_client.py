import aiohttp
import asyncio
from schemas.ai_schemas import GeminiResponse
import time
import json
from typing import List, Dict, Optional
from collections import defaultdict
from datetime import datetime


class AdvancedGeminiClient:
    def __init__(self, api_key: str, max_concurrent: int = 3, requests_per_minute: int = 10):
        self.api_key = api_key
        
        self.base_url = "https://generativelanguage.googleapis.com/v1beta/models"
        
        self.semaphore = asyncio.Semaphore(max_concurrent)
        
        self.requests_per_minute = requests_per_minute
        self.last_request_time = 0
        
        self.working_models = [
            "gemma-3-4b-it",
            "gemma-3-1b-it",
            "gemini-flash-latest",
            "gemini-flash-lite-latest"
        ]
        
        self.model_health = {
            model: {
                'available': True,
                'last_error': None,
                'error_time': None,
                'consecutive_failures': 0,
                'success_count': 0,
                'total_calls': 0,
                'last_success': None,
                'last_checked': None
            }
            for model in self.working_models
        }
        
        self.active_model = self.working_models[0]
        
        self.quota_errors = defaultdict(int)
        self.model_blacklist_time = {}
        
        print(f"Gemini client initialized with {len(self.working_models)} models")
        print(f"Primary model: {self.working_models[0]}")
    
    async def _rate_limit(self):
        now = time.time()
        time_since_last = now - self.last_request_time
        
        min_interval = 60.0 / self.requests_per_minute
        
        if time_since_last < min_interval:
            await asyncio.sleep(min_interval - time_since_last)
        
        self.last_request_time = time.time()
    
    def _select_next_model(self) -> str:
        current_time = time.time()
        
        for model in self.working_models:
            health = self.model_health[model]
            
            if model in self.model_blacklist_time:
                blacklist_until = self.model_blacklist_time[model]
                if current_time < blacklist_until:
                    continue
            
            if health['consecutive_failures'] >= 3:
                continue
            
            return model
        
        return self.working_models[0]
    
    def _handle_quota_error(self, model: str, error_message: str):
        print(f"Model {model} exceeded quota")
        
        if "Please retry in" in error_message:
            try:
                import re
                match = re.search(r'Please retry in (\d+\.?\d*)s', error_message)
                if match:
                    retry_seconds = float(match.group(1))
                    blacklist_time = time.time() + retry_seconds + 5
                else:
                    blacklist_time = time.time() + 60
            except:
                blacklist_time = time.time() + 60
        else:
            blacklist_time = time.time() + 300
        
        self.model_blacklist_time[model] = blacklist_time
        self.model_health[model]['available'] = False
        self.model_health[model]['last_error'] = "Quota exceeded"
        self.model_health[model]['error_time'] = time.time()
        
        self.active_model = self._select_next_model()
        print(f"Switching to: {self.active_model}")
    
    def _update_model_health(self, model: str, success: bool, error: str = None):
        health = self.model_health[model]
        health['total_calls'] += 1
        health['last_checked'] = time.time()
        
        if success:
            health['consecutive_failures'] = 0
            health['success_count'] += 1
            health['last_success'] = time.time()
            health['available'] = True
            health['last_error'] = None
            
            if model in self.model_blacklist_time:
                del self.model_blacklist_time[model]
        else:
            health['consecutive_failures'] += 1
            health['last_error'] = error
            health['error_time'] = time.time()
            
            if health['consecutive_failures'] >= 3:
                blacklist_time = time.time() + 30
                self.model_blacklist_time[model] = blacklist_time
    
    async def generate_with_retry(self, prompt: str, max_retries: int = 2) -> GeminiResponse:
        last_error = None
        models_tried = set()
        
        for attempt in range(max_retries):
            current_model = self._select_next_model()
            
            if current_model in models_tried:
                available = [m for m in self.working_models 
                           if m not in models_tried and 
                           (m not in self.model_blacklist_time or 
                            time.time() >= self.model_blacklist_time.get(m, 0))]
                
                if available:
                    current_model = available[0]
                else:
                    wait_time = 2 ** attempt
                    await asyncio.sleep(wait_time)
                    continue
            
            models_tried.add(current_model)
            
            url = f"{self.base_url}/{current_model}:generateContent?key={self.api_key}"
            
            config = {
                "temperature": 0.7,
                "maxOutputTokens": 1000,
            }
            
            if "gemma" in current_model:
                config["temperature"] = 0.8
            if "lite" in current_model:
                config["maxOutputTokens"] = 500
            
            payload = {
                "contents": [{
                    "parts": [{
                        "text": prompt
                    }]
                }],
                "generationConfig": config
            }
            
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
                            },
                            timeout=aiohttp.ClientTimeout(total=10)
                        ) as response:
                            
                            response_text = await response.text()
                            latency = time.time() - start_time
                            
                            if response.status == 200:
                                data = json.loads(response_text)
                                
                                if "candidates" in data and data["candidates"]:
                                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                                    
                                    self._update_model_health(current_model, True)
                                    self.active_model = current_model
                                    
                                    return GeminiResponse(
                                        prompt=prompt,
                                        response_text=text.strip(),
                                        error=None,
                                        latency=latency,
                                        model_used=current_model
                                    )
                                else:
                                    last_error = "No candidates in response"
                                    self._update_model_health(current_model, False, last_error)
                                    
                            else:
                                error_msg = f"HTTP {response.status}"
                                try:
                                    error_data = json.loads(response_text)
                                    error_msg = error_data.get("error", {}).get("message", response_text[:200])
                                except:
                                    error_msg = response_text[:200]
                                
                                last_error = error_msg
                                self._update_model_health(current_model, False, error_msg)
                                
                                if response.status == 429 or "quota" in error_msg.lower():
                                    self._handle_quota_error(current_model, error_msg)
                                    continue
                                
                                if response.status in [400, 401, 403]:
                                    break
                                    
                                wait_time = 2 ** attempt
                                await asyncio.sleep(wait_time)
                                
            except asyncio.TimeoutError:
                last_error = f"Timeout with model {current_model}"
                self._update_model_health(current_model, False, "Timeout")
                await asyncio.sleep(2 ** attempt)
                
            except aiohttp.ClientError as e:
                last_error = f"Network error: {str(e)}"
                self._update_model_health(current_model, False, str(e))
                await asyncio.sleep(2 ** attempt)
                
            except Exception as e:
                last_error = f"Unexpected error: {str(e)}"
                self._update_model_health(current_model, False, str(e))
                await asyncio.sleep(2 ** attempt)
        
        return GeminiResponse(
            prompt=prompt,
            response_text=None,
            error=last_error or "All models failed",
            latency=0,
            model_used=None
        )
    
    async def quick_health_check(self) -> List[str]:
        current_time = time.time()
        healthy_models = []
        
        for model in self.working_models:
            health = self.model_health[model]
            
            if model in self.model_blacklist_time:
                if current_time < self.model_blacklist_time[model]:
                    continue
            
            if health['consecutive_failures'] >= 3:
                continue
            
            healthy_models.append(model)
        
        return healthy_models
    
    def get_model_stats(self) -> Dict:
        stats = {
            'total_models': len(self.working_models),
            'active_model': self.active_model,
            'blacklisted_models': [],
            'available_models': [],
            'model_health': {}
        }
        
        current_time = time.time()
        
        for model, health in self.model_health.items():
            is_blacklisted = (
                model in self.model_blacklist_time and 
                current_time < self.model_blacklist_time[model]
            )
            
            if is_blacklisted:
                stats['blacklisted_models'].append(model)
            elif health['consecutive_failures'] < 3:
                stats['available_models'].append(model)
            
            stats['model_health'][model] = {
                'available': not is_blacklisted and health['consecutive_failures'] < 3,
                'success_count': health['success_count'],
                'total_calls': health['total_calls'],
                'consecutive_failures': health['consecutive_failures'],
                'success_rate': health['success_count'] / health['total_calls'] if health['total_calls'] > 0 else 0,
                'last_success': health['last_success'],
                'last_error': health['last_error']
            }
        
        return stats
    
    async def batch_generate(self, prompts: List[str], max_concurrent: int = None) -> List[GeminiResponse]:
        if max_concurrent:
            self.semaphore = asyncio.Semaphore(max_concurrent)
        
        tasks = [self.generate_with_retry(prompt) for prompt in prompts]
        results = await asyncio.gather(*tasks)
        
        return results