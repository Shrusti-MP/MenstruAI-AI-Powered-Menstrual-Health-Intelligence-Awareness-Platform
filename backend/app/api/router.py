from fastapi import APIRouter
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.tracking import router as tracking_router
from app.api.analytics import router as analytics_router
from app.api.education import router as education_router
from app.api.myths_facts import router as myths_facts_router
from app.api.quiz import router as quiz_router
from app.api.recommendations import router as recommendations_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(users_router)
api_router.include_router(tracking_router)
api_router.include_router(analytics_router)
api_router.include_router(education_router)
api_router.include_router(myths_facts_router)
api_router.include_router(quiz_router)
api_router.include_router(recommendations_router)
