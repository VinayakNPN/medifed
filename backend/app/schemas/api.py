from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class HospitalBase(BaseModel):
    name: str
    status: str
    dataset_size: int
    has_dataset: bool = False
    features_count: int = 0

class HospitalResponse(HospitalBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class DashboardStats(BaseModel):
    total_hospitals: int
    active_training_rounds: int
    average_accuracy: float
    encrypted_operations: int
    system_status: str

class BlockchainEventResponse(BaseModel):
    id: int
    event_type: str
    tx_hash: str
    status: str
    timestamp: datetime
    class Config:
        orm_mode = True

class TrainingStatusResponse(BaseModel):
    round_id: int
    status: str
    global_accuracy: float
    current_epoch: int
    privacy_budget: float

class LogEntry(BaseModel):
    id: str
    time: str
    message: str
    type: str

class HospitalSimState(BaseModel):
    id: int
    name: str
    status: str
    progress: int
    accuracy: float
    dataset: str

class SimulationStateResponse(BaseModel):
    sim_state: str
    round: int
    global_accuracy: float
    privacy_budget: float
    fhenix_stage: int
    hospitals: List[HospitalSimState]
    logs: List[LogEntry]

class DatasetMetadataResponse(BaseModel):
    hospital_id: int
    dataset_hash: str
    rows: int
    features: int
    target_column: str
    missing_values: dict
    class_distribution: dict
    upload_timestamp: str
    status: str

class DatasetUploadResponse(BaseModel):
    status: str
    message: str
    metadata: DatasetMetadataResponse

class TrainingMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float

class TrainingResultResponse(BaseModel):
    hospital_id: int
    metrics: TrainingMetrics
    training_duration_seconds: float

class TrainingStatusResponseLocal(BaseModel):
    hospital_id: int
    status: str

class ModelUpdateResponse(BaseModel):
    hospital_id: int
    round_id: int
    model_version: str
    size_bytes: int
    samples_used: int
    status: str
