from fastapi import APIRouter, Depends, BackgroundTasks
import asyncio
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.session import get_db
from app.models.domain import GlobalModelMetadata, Hospital
from app.services.event_publisher import event_publisher

router = APIRouter()

@router.get("/status")
def get_coordinator_status(db: Session = Depends(get_db)):
    latest_model = db.query(GlobalModelMetadata).order_by(GlobalModelMetadata.version.desc()).first()
    hospitals_count = db.query(Hospital).count()
    completed_rounds = db.query(func.max(GlobalModelMetadata.round_id)).scalar() or 0
    
    return {
        "current_training_round": completed_rounds + 1,
        "global_model_version": latest_model.version if latest_model else 0,
        "current_global_accuracy": latest_model.accuracy if latest_model else 0.0,
        "hospitals_count": hospitals_count,
        "completed_rounds": completed_rounds,
        "latest_publication": latest_model.created_at.isoformat() if latest_model else None
    }

@router.get("/history")
def get_training_history(db: Session = Depends(get_db)):
    history = db.query(GlobalModelMetadata).order_by(GlobalModelMetadata.version.asc()).all()
    return [
        {
            "version": m.version,
            "accuracy": m.accuracy,
            "round": m.round_id,
            "timestamp": m.created_at.isoformat()
        } for m in history
    ]

async def run_federated_pipeline():
    """
    Simulates the timing of the 15-stage workflow for the frontend visualization,
    publishing SSE events at each stage.
    """
    stages = [
        ("Dataset Uploaded", 2),
        ("Training Started", 3),
        ("Local Model Finished", 1),
        ("Model Update Extracted", 1),
        ("Differential Privacy Applied", 2),
        ("Quantization Completed", 1),
        ("Payload Validated", 1),
        ("Submitting To Fhenix", 2),
        ("Confidential Computation Running", 4),
        ("Confidential Aggregation Complete", 2),
        ("Coordinator Validation", 1),
        ("Global Model Updated", 1),
        ("Model Evaluation", 1),
        ("Model Published", 1),
        ("Hospitals Synchronizing", 2),
        ("Training Complete", 0)
    ]
    
    for idx, (state, delay) in enumerate(stages):
        await event_publisher.publish("WORKFLOW_STATE", {
            "state": state,
            "fhenix_stage": max(0, idx - 7),
            "log": f"System Status: {state}..."
        })
        if delay > 0:
            await asyncio.sleep(delay)

@router.post("/trigger")
async def trigger_training(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    background_tasks.add_task(run_federated_pipeline)
    return {"status": "Training cycle initiated"}

@router.get("/contributions")
def get_contributions():
    # Simulated contribution data as requested by the user
    return [
        {"hospital": "Hospital A", "accuracy_gain": "+2.8%", "privacy_budget": "\u03b5 = 0.8", "trust_score": "97%", "contribution": "\u2b50 Highest"},
        {"hospital": "Hospital B", "accuracy_gain": "+1.1%", "privacy_budget": "\u03b5 = 0.7", "trust_score": "91%", "contribution": "High"},
        {"hospital": "Hospital C", "accuracy_gain": "-0.2%", "privacy_budget": "\u03b5 = 1.0", "trust_score": "64%", "contribution": "Low"}
    ]
