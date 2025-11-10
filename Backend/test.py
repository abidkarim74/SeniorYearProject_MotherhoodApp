# debug_gemini.py
import os
import aiohttp
import asyncio
import json
from dotenv import load_dotenv


load_dotenv()

async def debug_gemini_api():
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ GEMINI_API_KEY environment variable is not set")
        print("💡 Run: export GEMINI_API_KEY='your_key_here'")
        return
    
    print(f"🔑 API Key: {api_key[:10]}...{api_key[-5:]}")
    
    # Test different models
    models = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-001", 
        "gemini-pro-latest",
        "gemini-2.5-flash",
        "gemini-2.5-pro"
    ]
    
    for model in models:
        print(f"\n🧪 Testing model: {model}")
        
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
        
        payload = {
            "contents": [{
                "parts": [{"text": "Say 'TEST'"}]
            }]
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    url,
                    json=payload,
                    headers={'Content-Type': 'application/json'},
                    timeout=10
                ) as response:
                    
                    print(f"   Status: {response.status}")
                    print(f"   Headers: {dict(response.headers)}")
                    
                    response_text = await response.text()
                    
                    if response.status == 200:
                        print(f"   ✅ SUCCESS with {model}!")
                        data = json.loads(response_text)
                        text = data["candidates"][0]["content"]["parts"][0]["text"]
                        print(f"   Response: {text}")
                        break
                    else:
                        print(f"   ❌ Failed: {response_text[:200]}")
                        
        except Exception as e:
            print(f"   💥 Exception: {str(e)}")

if __name__ == "__main__":
    print("🔍 Gemini API Debug Tool")
    asyncio.run(debug_gemini_api())