import numpy as np
from opacus.accountants import RDPAccountant
from app.services.extractor import ModelUpdate

class PrivacyService:
    def __init__(self):
        # We initialize a global RDP accountant to track cumulative privacy loss
        # over multiple rounds of federation.
        self.accountant = RDPAccountant()
        
        # Configuration for Differential Privacy
        self.clipping_norm = 1.0
        self.noise_multiplier = 0.5
        
        # Global tracking
        self.total_epsilon = 0.0
        self.total_delta = 1e-5
        self.budget_limit = 10.0

    def apply_dp(self, update: ModelUpdate) -> ModelUpdate:
        """
        Applies Output Perturbation (Local Differential Privacy) to the model update.
        1. Clips the L2 norm of the deltas.
        2. Adds Gaussian noise.
        3. Updates the privacy accountant.
        """
        # 1. Gradient Clipping (L2 Norm)
        weight_norm = np.linalg.norm(update.weight_delta)
        if weight_norm > self.clipping_norm:
            update.weight_delta = update.weight_delta * (self.clipping_norm / weight_norm)
            
        if hasattr(update.bias_delta, '__len__'):
            bias_norm = np.linalg.norm(update.bias_delta)
            if bias_norm > self.clipping_norm:
                update.bias_delta = update.bias_delta * (self.clipping_norm / bias_norm)
        else:
            if abs(update.bias_delta) > self.clipping_norm:
                update.bias_delta = np.sign(update.bias_delta) * self.clipping_norm

        # 2. Add Gaussian Noise
        # Noise ~ N(0, (noise_multiplier * clipping_norm)^2)
        noise_std = self.noise_multiplier * self.clipping_norm
        
        weight_noise = np.random.normal(0, noise_std, size=update.weight_delta.shape)
        update.weight_delta = update.weight_delta + weight_noise
        
        if hasattr(update.bias_delta, '__len__'):
            bias_noise = np.random.normal(0, noise_std, size=update.bias_delta.shape)
            update.bias_delta = update.bias_delta + bias_noise
        else:
            update.bias_delta = update.bias_delta + np.random.normal(0, noise_std)

        # 3. Privacy Accountant (Opacus)
        # We treat this update as one "step" of training over the hospital's dataset
        sample_rate = 1.0 # In LDP output perturbation, the whole dataset is queried
        self.accountant.step(noise_multiplier=self.noise_multiplier, sample_rate=sample_rate)
        
        # Calculate current epsilon
        epsilon = self.accountant.get_epsilon(delta=self.total_delta)
        self.total_epsilon = epsilon
        
        # 4. Attach metadata to the update
        update.epsilon = epsilon
        update.delta = self.total_delta
        
        return update
        
    def get_privacy_status(self):
        """Returns the current privacy metrics"""
        return {
            "cumulative_epsilon": round(self.total_epsilon, 4),
            "target_delta": self.total_delta,
            "budget_limit": self.budget_limit,
            "clipping_norm": self.clipping_norm,
            "noise_multiplier": self.noise_multiplier,
            "status": "Safe" if self.total_epsilon < self.budget_limit else "Budget Exceeded"
        }

privacy_service = PrivacyService()
