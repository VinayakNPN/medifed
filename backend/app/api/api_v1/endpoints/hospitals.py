import json
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.domain import Hospital
from app.schemas.api import HospitalResponse, DatasetUploadResponse
from app.services.dataset_manager import dataset_manager

router = APIRouter()

@router.get("/", response_model=List[HospitalResponse])
def get_hospitals(db: Session = Depends(get_db)):
    """Get all connected hospitals"""
    hospitals = db.query(Hospital).all()
    # Initialize mock hospitals if DB is empty
    if not hospitals:
        mocks = [
            Hospital(name="Hospital A (Cardiology)"),
            Hospital(name="Hospital B (Oncology)"),
            Hospital(name="Hospital C (Neurology)")
        ]
        db.add_all(mocks)
        db.commit()
        hospitals = db.query(Hospital).all()
    return hospitals

@router.post("/{hospital_id}/dataset", response_model=DatasetUploadResponse)
async def upload_dataset(
    hospital_id: int, 
    file: UploadFile = File(...), 
    db: Session = Depends(get_db)
):
    """
    Upload a CSV dataset for local training.
    The file is stored ephemerally, analyzed, and deleted immediately to preserve privacy.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
        
    metadata = await dataset_manager.process_dataset(hospital_id, file, db)
    
    return {
        "status": "success",
        "message": f"Dataset {file.filename} processed and securely deleted.",
        "metadata": metadata
    }

@router.get("/{hospital_id}/dataset/metadata")
def get_dataset_metadata(hospital_id: int, db: Session = Depends(get_db)):
    """Retrieve the stored metadata for a hospital's dataset"""
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
        
    if not hospital.has_dataset:
        return {"has_dataset": False}
        
    return {
        "has_dataset": True,
        "rows": hospital.dataset_size,
        "features": hospital.features_count,
        "class_distribution": json.loads(hospital.class_distribution),
        "last_updated": hospital.created_at
    }

from app.services.trainer import local_trainer
from app.schemas.api import TrainingResultResponse, TrainingStatusResponseLocal, ModelUpdateResponse
from app.models.domain import LocalModelMetadata, ModelUpdateMetadata, Hospital
from app.services.extractor import update_extractor
import os

@router.post("/{hospital_id}/train")
def start_local_training(hospital_id: int, db: Session = Depends(get_db)):
    """
    Train local model on hospital's dataset.
    Automatically deletes the dataset after training.
    """
    # For this hackathon scope, we execute synchronously. 
    # In production, this would be an async background task.
    result = local_trainer.train_model(hospital_id, db)
    return {"status": "Training completed", "hospital_id": hospital_id}

@router.get("/{hospital_id}/train/status", response_model=TrainingStatusResponseLocal)
def get_local_training_status(hospital_id: int, db: Session = Depends(get_db)):
    """Get training status for local model"""
    # Check if a model exists on disk or if metadata exists
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
        
    metadata = db.query(LocalModelMetadata).filter(LocalModelMetadata.hospital_id == hospital_id).first()
    if metadata:
        return {"hospital_id": hospital_id, "status": "Completed"}
    
    # Check if dataset exists but model not yet trained
    DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "hospitals")
    if os.path.exists(os.path.join(DATA_DIR, str(hospital_id), "dataset.csv")):
        return {"hospital_id": hospital_id, "status": "Ready to train"}
        
    return {"hospital_id": hospital_id, "status": "No dataset uploaded"}

@router.get("/{hospital_id}/train/result", response_model=TrainingResultResponse)
def get_local_training_result(hospital_id: int, db: Session = Depends(get_db)):
    """Get metrics for trained local model"""
    metadata = db.query(LocalModelMetadata).filter(LocalModelMetadata.hospital_id == hospital_id).order_by(LocalModelMetadata.id.desc()).first()
    if not metadata:
        raise HTTPException(status_code=404, detail="No trained model found for this hospital")
        
    return {
        "hospital_id": hospital_id,
        "metrics": {
            "accuracy": metadata.accuracy,
            "precision": metadata.precision,
            "recall": metadata.recall,
            "f1_score": metadata.f1_score
        },
        "training_duration_seconds": metadata.training_duration_seconds
    }

@router.post("/{hospital_id}/model/update", response_model=ModelUpdateResponse)
def trigger_model_update_extraction(hospital_id: int, db: Session = Depends(get_db)):
    """
    Manually trigger the model update extraction if it failed or needs to be re-run.
    (Note: This normally runs automatically after training).
    """
    hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
        
    metadata = db.query(ModelUpdateMetadata).filter(ModelUpdateMetadata.hospital_id == hospital_id).order_by(ModelUpdateMetadata.id.desc()).first()
    if not metadata:
        raise HTTPException(status_code=404, detail="No model update available to extract")
        
    return {
        "hospital_id": metadata.hospital_id,
        "round_id": metadata.round_id,
        "model_version": metadata.model_version,
        "size_bytes": metadata.size_bytes,
        "samples_used": metadata.samples_used,
        "status": "Extracted"
    }

@router.get("/{hospital_id}/model/update", response_model=ModelUpdateResponse)
def get_model_update_metadata(hospital_id: int, db: Session = Depends(get_db)):
    """
    Retrieve metadata about the latest serialized ModelUpdate object (.pkl).
    """
    metadata = db.query(ModelUpdateMetadata).filter(ModelUpdateMetadata.hospital_id == hospital_id).order_by(ModelUpdateMetadata.id.desc()).first()
    if not metadata:
        raise HTTPException(status_code=404, detail="No model update found")
        
    return {
        "hospital_id": metadata.hospital_id,
        "round_id": metadata.round_id,
        "model_version": metadata.model_version,
        "size_bytes": metadata.size_bytes,
        "samples_used": metadata.samples_used,
        "status": "Ready for encryption"
    }
