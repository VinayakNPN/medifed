from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.session import Base

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    status = Column(String, default="active")
    dataset_size = Column(Integer, default=0)
    features_count = Column(Integer, default=0)
    class_distribution = Column(String, default="{}") # JSON string
    has_dataset = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TrainingRound(Base):
    __tablename__ = "training_rounds"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String)
    global_accuracy = Column(Float)
    current_epoch = Column(Integer)
    privacy_budget = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class LocalModelMetadata(Base):
    __tablename__ = "local_model_metadata"
    
    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, index=True)
    accuracy = Column(Float, default=0.0)
    precision = Column(Float, default=0.0)
    recall = Column(Float, default=0.0)
    f1_score = Column(Float, default=0.0)
    training_duration_seconds = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ModelUpdateMetadata(Base):
    __tablename__ = "model_update_metadata"
    
    id = Column(Integer, primary_key=True, index=True)
    hospital_id = Column(Integer, index=True)
    round_id = Column(Integer, default=1)
    model_version = Column(String, default="1.0")
    size_bytes = Column(Integer, default=0)
    samples_used = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BlockchainEvent(Base):
    __tablename__ = "blockchain_events"

    id = Column(Integer, primary_key=True, index=True)
    event_type = Column(String, index=True)
    tx_hash = Column(String, unique=True, index=True)
    status = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class GlobalModelMetadata(Base):
    __tablename__ = "global_model_metadata"
    
    id = Column(Integer, primary_key=True, index=True)
    version = Column(Integer, unique=True, index=True)
    accuracy = Column(Float)
    round_id = Column(Integer)
    participants_count = Column(Integer)
    fhenix_tx_ref = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
