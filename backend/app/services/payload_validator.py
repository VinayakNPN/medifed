import hashlib
from fastapi import HTTPException
from app.services.quantization import QuantizedModelUpdate

class PayloadValidator:
    """
    Validates a QuantizedModelUpdate before it is sent to the Fhenix Gateway
    or before the Coordinator accepts it.
    """
    def validate(self, update: QuantizedModelUpdate):
        # 1. Model version
        if not isinstance(update.model_version, str) or not update.model_version.startswith("v"):
            raise HTTPException(status_code=400, detail="Invalid model version format. Must start with 'v'.")
            
        # 2. Hospital ID
        if update.hospital_id <= 0:
            raise HTTPException(status_code=400, detail="Invalid hospital ID.")
            
        # 3. Round ID
        if update.round_id <= 0:
            raise HTTPException(status_code=400, detail="Invalid round ID.")
            
        # 4. Checksum verification
        weight_bytes = update.weight_delta_int.tobytes()
        bias_bytes = update.bias_delta_int.tobytes() if hasattr(update.bias_delta_int, 'tobytes') else str(update.bias_delta_int).encode()
        expected_checksum = hashlib.sha256(weight_bytes + bias_bytes).hexdigest()
        
        if update.checksum != expected_checksum:
            raise HTTPException(status_code=400, detail="Payload corruption detected. Checksum mismatch.")
            
        # 5. Tensor dimensions
        if not update.tensor_dims or len(update.tensor_dims) == 0:
            raise HTTPException(status_code=400, detail="Invalid tensor dimensions.")
            
        # 6. Scaling factor
        if update.scaling_factor <= 0:
            raise HTTPException(status_code=400, detail="Invalid scaling factor.")
            
        return True

payload_validator = PayloadValidator()
