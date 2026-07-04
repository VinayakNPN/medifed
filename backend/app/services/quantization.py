import numpy as np
import hashlib
from app.services.extractor import ModelUpdate

class QuantizedModelUpdate:
    def __init__(self, hospital_id, round_id, model_version, weight_delta_int, bias_delta_int, scaling_factor, epsilon, delta, timestamp, checksum, tensor_dims):
        self.hospital_id = hospital_id
        self.round_id = round_id
        self.model_version = model_version
        self.weight_delta_int = weight_delta_int
        self.bias_delta_int = bias_delta_int
        self.scaling_factor = scaling_factor
        self.epsilon = epsilon
        self.delta = delta
        self.timestamp = timestamp
        self.checksum = checksum
        self.tensor_dims = tensor_dims

class QuantizationService:
    def __init__(self):
        # We use a large scaling factor (1 million) to preserve precision
        # when converting floats to fixed-point integers for FHE.
        self.scaling_factor = 1e6
        
    def quantize(self, update: ModelUpdate) -> QuantizedModelUpdate:
        """
        Converts floating point deltas to fixed-point integers.
        Outputs QuantizedModelUpdate strictly prepared for FHE.
        """
        # Scale and convert to int64
        weight_int = np.round(update.weight_delta * self.scaling_factor).astype(np.int64)
        bias_int = np.round(update.bias_delta * self.scaling_factor).astype(np.int64)
        
        # Calculate a strong deterministic checksum based on the integers
        weight_bytes = weight_int.tobytes()
        bias_bytes = bias_int.tobytes() if hasattr(bias_int, 'tobytes') else str(bias_int).encode()
        checksum = hashlib.sha256(weight_bytes + bias_bytes).hexdigest()
        
        return QuantizedModelUpdate(
            hospital_id=update.hospital_id,
            round_id=update.round_id,
            model_version=update.model_version,
            weight_delta_int=weight_int,
            bias_delta_int=bias_int,
            scaling_factor=self.scaling_factor,
            epsilon=getattr(update, 'epsilon', 0.0),
            delta=getattr(update, 'delta', 1e-5),
            timestamp=update.timestamp,
            checksum=checksum,
            tensor_dims=weight_int.shape
        )

quantization_service = QuantizationService()
