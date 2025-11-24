from fastapi import APIRouter


vaccination_reminder_router = APIRouter(
    prefix='/api/vaccination-reminders',
    tags='Vaccination Reminders'
)

