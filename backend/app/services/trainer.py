import os
import time
import pandas as pd
import joblib
from sqlalchemy.orm import Session
from fastapi import HTTPException
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from app.models.domain import LocalModelMetadata, Hospital, ModelUpdateMetadata
from app.services.extractor import update_extractor
from app.services.privacy import privacy_service
from app.services.quantization import quantization_service
from app.services.payload_validator import payload_validator
import joblib

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "hospitals")

class LocalTrainer:
    def train_model(self, hospital_id: int, db: Session) -> dict:
        hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
            
        hospital_dir = os.path.join(DATA_DIR, str(hospital_id))
        dataset_filepath = os.path.join(hospital_dir, "dataset.csv")
        model_filepath = os.path.join(hospital_dir, "local_model.pkl")
        
        if not os.path.exists(dataset_filepath):
            raise HTTPException(status_code=400, detail="No dataset found for this hospital. Please upload a dataset first.")
            
        from sklearn.linear_model import SGDClassifier
        from app.services.global_model import global_model_manager
        import copy
        import numpy as np
        
        try:
            start_time = time.time()
            
            # Load dataset
            df = pd.read_csv(dataset_filepath)
            
            # Assume last column is target, all others are features
            X = df.iloc[:, :-1]
            y = df.iloc[:, -1]
            
            # Split dataset
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
            
            # Load global model to start from its weights
            global_model = global_model_manager.get_latest_global_model()
            if global_model is not None:
                model = copy.deepcopy(global_model)
            else:
                model = SGDClassifier(loss='log_loss', warm_start=True, random_state=42, learning_rate='constant', eta0=0.01)
            
            # Train model locally for a few epochs
            for _ in range(5):
                model.partial_fit(X_train, y_train, classes=np.array([0, 1]))
            
            # Evaluate model
            y_pred = model.predict(X_test)
            acc = accuracy_score(y_test, y_pred)
            
            # For multi-class or binary, 'weighted' handles both reasonably well for a baseline
            prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
            rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
            f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
            
            # Save trained model to disk
            joblib.dump(model, model_filepath)
            
            end_time = time.time()
            duration = end_time - start_time
            
            # Calculate samples used
            samples_used = len(X_train)
            
            # 1. Extract Update (Weight/Bias Delta vs Global Model)
            metrics_dict = {
                'accuracy': acc,
                'precision': prec,
                'recall': rec,
                'f1_score': f1
            }
            
            # Using mock initial privacy values (which get updated by DP accountant)
            filepath, update, file_size = update_extractor.extract_update(
                hospital_id=hospital_id,
                local_model=model,
                metrics=metrics_dict,
                samples_used=samples_used,
                epsilon=0.0,
                privacy_delta=1e-5
            )
            
            # 2. Apply Differential Privacy (LDP Output Perturbation)
            update = privacy_service.apply_dp(update)
            
            # 3. Quantization (Float -> Fixed Point Integer for FHE)
            quantized_update = quantization_service.quantize(update)
            
            # 4. Payload Validation
            payload_validator.validate(quantized_update)
            
            # Resave the validated, quantized update
            joblib.dump(quantized_update, filepath)
            
            # 5. Store Update Metadata in DB
            update_meta = ModelUpdateMetadata(
                hospital_id=hospital_id,
                round_id=quantized_update.round_id,
                model_version=quantized_update.model_version,
                size_bytes=file_size,
                samples_used=samples_used
            )
            db.add(update_meta)
            
            # 6. Store Local Model Metadata in DB
            metadata = LocalModelMetadata(
                hospital_id=hospital_id,
                accuracy=acc,
                precision=prec,
                recall=rec,
                f1_score=f1,
                training_duration_seconds=duration
            )
            db.add(metadata)
            db.commit()
            
            return {
                "hospital_id": hospital_id,
                "metrics": {
                    "accuracy": acc,
                    "precision": prec,
                    "recall": rec,
                    "f1_score": f1
                },
                "training_duration_seconds": duration
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Model training failed: {str(e)}")

local_trainer = LocalTrainer()
