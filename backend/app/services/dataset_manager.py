import os
import uuid
import pandas as pd
import json
import hashlib
from datetime import datetime
from fastapi import UploadFile, HTTPException
from app.models.domain import Hospital
from sqlalchemy.orm import Session

# We'll use a hospital specific directory to store files until they are trained
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "hospitals")

class DatasetManager:
    async def process_dataset(self, hospital_id: int, file: UploadFile, db: Session) -> dict:
        hospital = db.query(Hospital).filter(Hospital.id == hospital_id).first()
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        # 1. Hospital Storage Directory
        hospital_dir = os.path.join(DATA_DIR, str(hospital_id))
        os.makedirs(hospital_dir, exist_ok=True)
        
        # Save file to disk
        dataset_filepath = os.path.join(hospital_dir, "dataset.csv")
        
        with open(dataset_filepath, "wb") as f:
            content = await file.read()
            f.write(content)
            
        # 2. Extract Metadata using Pandas
        try:
            # Compute dataset hash
            with open(dataset_filepath, "rb") as f:
                dataset_hash = hashlib.sha256(f.read()).hexdigest()
                
            df = pd.read_csv(dataset_filepath)
            
            if len(df.columns) < 2:
                raise ValueError("Dataset must contain at least one feature column and one target column.")
            if len(df) < 10:
                raise ValueError("Dataset must contain at least 10 rows for meaningful training.")
                
            rows = len(df)
            features = len(df.columns)
                
            # Assume the last column is the target variable for class distribution
            target_col = df.columns[-1]
            class_counts = df[target_col].value_counts().to_dict()
            # Convert keys to string for JSON serialization
            class_distribution = {str(k): int(v) for k, v in class_counts.items()}
            
            missing_values = df.isnull().sum().to_dict()
            missing_values_report = {str(k): int(v) for k, v in missing_values.items()}
            
            # 3. Update Hospital DB Record
            hospital.dataset_size = rows
            hospital.features_count = features
            hospital.class_distribution = json.dumps(class_distribution)
            hospital.has_dataset = True
            
            db.commit()
            db.refresh(hospital)
            
            metadata = {
                "hospital_id": hospital.id,
                "dataset_hash": dataset_hash,
                "rows": rows,
                "features": features,
                "target_column": target_col,
                "missing_values": missing_values_report,
                "class_distribution": class_distribution,
                "upload_timestamp": datetime.now().isoformat(),
                "status": "Dataset successfully ingested and stored securely."
            }
            
            return metadata
            
        except Exception as e:
            # If extraction fails, we should delete the faulty dataset
            if os.path.exists(dataset_filepath):
                os.remove(dataset_filepath)
            raise HTTPException(status_code=400, detail=f"Failed to parse CSV dataset: {str(e)}")

dataset_manager = DatasetManager()
