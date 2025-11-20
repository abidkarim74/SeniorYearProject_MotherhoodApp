from fastapi import FastAPI, Depends
from database.db import SessionLocal
from sqlalchemy import text
from router.auth_routes import auth_router
from middleware.protect_endpoints import verify_authentication
from fastapi.middleware.cors import CORSMiddleware
from router.child_routes import child_router
from router.profile_routes import profile_router
from router.ai_chatbot_routes import ai_chatbot_router
from router.password_reset_routes import password_router
from router.email_routes import email_router




app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    try:
        async with SessionLocal() as session:
            await session.execute(text("SELECT 1"))
            
        print("Database connected successfully.")
        
    except Exception as e:
        print(f"Database connection failed: {e}")
        
        
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(child_router)
app.include_router(ai_chatbot_router)
app.include_router(password_router)
app.include_router(email_router)


@app.get('/api/')
def index(payload = Depends(verify_authentication)):
    return 'dasd'