from fastapi import APIRouter
from app.services.privacy import privacy_service

router = APIRouter()

@router.get("/status")
def get_privacy_status():
    """
    Returns the cumulative privacy budget (epsilon, delta) tracked by Opacus 
    along with LDP configuration (clipping norm, noise multiplier).
    """
    return privacy_service.get_privacy_status()
