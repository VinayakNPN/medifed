import os
import joblib
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.domain import GlobalModelMetadata

GLOBAL_MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "global")
os.makedirs(GLOBAL_MODELS_DIR, exist_ok=True)

class ModelRegistry:
    def __init__(self):
        # Ensure base model exists
        if not os.path.exists(os.path.join(GLOBAL_MODELS_DIR, "v1.pkl")):
            # If no v1, create a dummy initialization (in a real app, this is trained on public data)
            from sklearn.linear_model import LogisticRegression
            model = LogisticRegression()
            import numpy as np
            # Mock initialization so it can be loaded
            model.classes_ = np.array([0, 1])
            model.coef_ = np.zeros((1, 10)) # Assuming 10 features default
            model.intercept_ = np.zeros((1,))
            joblib.dump(model, os.path.join(GLOBAL_MODELS_DIR, "v1.pkl"))

    def save_new_version(self, model, accuracy: float, round_id: int, participants: list, db: Session, fhenix_tx: str = None):
        """
        Permanently stores the new global model version without overwriting previous versions.
        Logs complete Model Provenance.
        """
        existing_models = db.query(GlobalModelMetadata).order_by(GlobalModelMetadata.version.desc()).all()
        next_version = 1 if not existing_models else existing_models[0].version + 1
        
        filename = f"v{next_version}.pkl"
        filepath = os.path.join(GLOBAL_MODELS_DIR, filename)
        
        joblib.dump(model, filepath)
        
        # Store Provenance
        metadata = GlobalModelMetadata(
            version=next_version,
            accuracy=accuracy,
            created_at=datetime.utcnow(),
            round_id=round_id,
            participants_count=len(participants),
            fhenix_tx_ref=fhenix_tx
        )
        db.add(metadata)
        db.commit()
        db.refresh(metadata)
        
        return metadata

    def get_latest_model_path(self):
        """Finds the highest version number file"""
        files = [f for f in os.listdir(GLOBAL_MODELS_DIR) if f.startswith("v") and f.endswith(".pkl")]
        if not files:
            return None
            
        # Extract integer versions: "v3.pkl" -> 3
        versions = [int(f.replace("v", "").replace(".pkl", "")) for f in files]
        max_version = max(versions)
        return os.path.join(GLOBAL_MODELS_DIR, f"v{max_version}.pkl")
        
    def load_latest_model(self):
        path = self.get_latest_model_path()
        if not path:
            return None
        return joblib.load(path)

model_registry = ModelRegistry()
