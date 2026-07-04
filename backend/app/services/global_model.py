import os
import joblib
from sklearn.linear_model import LogisticRegression

GLOBAL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "global")
os.makedirs(GLOBAL_DIR, exist_ok=True)
GLOBAL_MODEL_PATH = os.path.join(GLOBAL_DIR, "global_model.pkl")

class GlobalModelManager:
    def get_latest_global_model(self):
        if os.path.exists(GLOBAL_MODEL_PATH):
            return joblib.load(GLOBAL_MODEL_PATH)
        return None

global_model_manager = GlobalModelManager()
