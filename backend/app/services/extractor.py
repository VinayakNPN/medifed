import os
import joblib
import numpy as np
from datetime import datetime
from app.services.global_model import global_model_manager

class ModelUpdate:
    """
    Structured object containing exactly what the Fhenix coordinator needs.
    This entire object is serialized into a single .pkl file.
    """
    def __init__(self, hospital_id, round_id, model_version, weight_delta, bias_delta, accuracy, loss, samples_used, epsilon, delta, timestamp):
        self.hospital_id = hospital_id
        self.round_id = round_id
        self.model_version = model_version
        self.weight_delta = weight_delta
        self.bias_delta = bias_delta
        self.accuracy = accuracy
        self.loss = loss
        self.samples_used = samples_used
        self.epsilon = epsilon
        self.delta = delta
        self.timestamp = timestamp

class UpdateExtractor:
    def extract_update(self, hospital_id: int, local_model, metrics: dict, samples_used: int, epsilon: float, privacy_delta: float):
        global_model = global_model_manager.get_latest_global_model()
        
        # Calculate Delta
        if global_model is not None and hasattr(global_model, 'coef_'):
            # Must ensure shapes match
            if local_model.coef_.shape == global_model.coef_.shape:
                weight_delta = local_model.coef_ - global_model.coef_
                bias_delta = local_model.intercept_ - global_model.intercept_
            else:
                weight_delta = local_model.coef_
                bias_delta = local_model.intercept_
        else:
            # If no global model exists, delta is just the local weights
            weight_delta = local_model.coef_
            bias_delta = local_model.intercept_
            
        # Mocking round/version until aggregation is built
        round_id = 1
        model_version = "v1.0"
        
        update = ModelUpdate(
            hospital_id=hospital_id,
            round_id=round_id,
            model_version=model_version,
            weight_delta=weight_delta,
            bias_delta=bias_delta,
            accuracy=metrics.get('accuracy', 0.0),
            loss=metrics.get('loss', 0.0), 
            samples_used=samples_used,
            epsilon=epsilon,
            delta=privacy_delta,
            timestamp=datetime.now().isoformat()
        )
        
        # Save structured payload to disk
        DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "hospitals")
        hospital_dir = os.path.join(DATA_DIR, str(hospital_id))
        os.makedirs(hospital_dir, exist_ok=True)
        update_filepath = os.path.join(hospital_dir, "model_update.pkl")
        
        joblib.dump(update, update_filepath)
        
        # Calculate size in bytes for metadata
        file_size = os.path.getsize(update_filepath)
        
        return update_filepath, update, file_size

update_extractor = UpdateExtractor()
