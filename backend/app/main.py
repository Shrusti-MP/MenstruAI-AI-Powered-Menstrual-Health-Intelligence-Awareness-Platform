from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.database.session import SessionLocal, engine
from app.database.base import Base
from app.database.init_db import init_db
from app.api.router import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Ensure tables exist and seed demo content
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    yield
    # Shutdown events if needed


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="MenstruAI – AI-Powered Menstrual Health Intelligence & Awareness Platform API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# Set up CORS
if settings.BACKEND_CORS_ORIGINS:
    origins = [str(origin).rstrip("/") for origin in settings.BACKEND_CORS_ORIGINS]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Log the internal error in backend logs while returning safe user-facing message
    print(f"[Internal Server Error on {request.url.path}]: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected server error occurred. Please try again later."},
    )


@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "platform": "MenstruAI",
        "version": "1.0.0",
    }


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to MenstruAI API",
        "docs": f"{settings.API_V1_STR}/docs",
        "health": "/api/health",
    }


# Include all v1 API routers
app.include_router(api_router, prefix=settings.API_V1_STR)
