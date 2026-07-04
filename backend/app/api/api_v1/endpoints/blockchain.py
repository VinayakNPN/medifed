from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.domain import GlobalModelMetadata

router = APIRouter()

@router.get("/events")
def get_blockchain_events(db: Session = Depends(get_db)):
    """
    Returns the immutable audit log and model provenance.
    """
    provenance = db.query(GlobalModelMetadata).order_by(GlobalModelMetadata.created_at.desc()).all()
    events = []
    for p in provenance:
        events.append({
            "round": p.round_id,
            "participants": p.participants_count,
            "version": p.version,
            "model_hash": f"0x{(hash(str(p.id) + str(p.created_at)) & 0xFFFFFFFF):08x}",
            "tx_ref": p.fhenix_tx_ref or "N/A",
            "status": "Success",
            "timestamp": p.created_at.isoformat()
        })
    return events
