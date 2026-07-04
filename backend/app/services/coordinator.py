from app.services.fhenix_gateway import fhenix_gateway
from app.services.evaluator import global_evaluator
from app.services.registry import model_registry
from app.services.quantization import QuantizedModelUpdate
from sqlalchemy.orm import Session
from fastapi import HTTPException
import numpy as np

class CoordinatorService:
    def process_hospital_update(self, update: QuantizedModelUpdate, db: Session):
        """
        Executes Phase 9-13: Validation -> Fhenix Aggregation -> Dequantization -> Evaluation -> Registry
        """
        # 1. Fhenix Gateway (Confidential Aggregation via TS SDK -> Smart Contract)
        fhenix_result = fhenix_gateway.execute_confidential_workflow(update)
        tx_hash = fhenix_result.get("tx_hash")
        
        # Load current global model
        latest_model = model_registry.load_latest_model()
        if not latest_model:
            raise HTTPException(status_code=500, detail="No global model available.")
            
        previous_accuracy = getattr(latest_model, "last_accuracy", 0.90)
        
        # 2. De-quantization (Integer -> Float)
        # In reality, the fhenix_result would contain the unsealed aggregated integer array.
        # We simulate the unsealing output here for the pipeline:
        unsealed_weight_int = update.weight_delta_int
        unsealed_bias_int = update.bias_delta_int
        
        weight_delta = unsealed_weight_int.astype(np.float64) / update.scaling_factor
        bias_delta = unsealed_bias_int.astype(np.float64) / update.scaling_factor
        
        # 3. Apply Update to Global Model
        latest_model.coef_ += weight_delta
        latest_model.intercept_ += bias_delta
        
        # 4. Global Evaluation
        eval_result = global_evaluator.evaluate(latest_model, previous_accuracy)
        
        if not eval_result["passed"]:
            # Rollback: strictly reject the update to prevent accuracy degradation
            return {
                "status": "rejected",
                "reason": "Global model accuracy degraded.",
                "metrics": eval_result,
                "fhenix_tx": tx_hash
            }
            
        # 5. Model Registry (Provenance)
        latest_model.last_accuracy = eval_result["accuracy"]
        participants = [update.hospital_id] # Would be a list of all hospitals in batch
        
        registry_meta = model_registry.save_new_version(
            model=latest_model,
            accuracy=eval_result["accuracy"],
            round_id=update.round_id,
            participants=participants,
            db=db,
            fhenix_tx=tx_hash
        )
        
        return {
            "status": "published",
            "version": f"v{registry_meta.version}",
            "metrics": eval_result,
            "fhenix_tx": tx_hash,
            "provenance": {
                "built_from_hospitals": participants,
                "round": update.round_id,
                "privacy_budget": update.epsilon
            }
        }

coordinator_service = CoordinatorService()
