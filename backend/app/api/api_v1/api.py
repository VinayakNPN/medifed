from fastapi import APIRouter

from app.api.api_v1.endpoints import (
    hospitals,
    privacy,
    coordinator,
    prediction,
    blockchain,
    stream
)

api_router = APIRouter()

api_router.include_router(coordinator.router, prefix="/coordinator", tags=["Coordinator"])
api_router.include_router(hospitals.router, prefix="/hospitals", tags=["Hospitals"])
api_router.include_router(privacy.router, prefix="/privacy", tags=["Privacy"])
api_router.include_router(prediction.router, prefix="/prediction", tags=["Prediction"])
api_router.include_router(blockchain.router, prefix="/blockchain", tags=["Blockchain"])
api_router.include_router(stream.router, prefix="/stream", tags=["Real-Time Stream"])
