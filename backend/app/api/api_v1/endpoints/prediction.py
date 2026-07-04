from fastapi import APIRouter
from app.services.registry import model_registry
import time
import os
import numpy as np

router = APIRouter()

@router.post("/")
def make_prediction(data: dict):
    start = time.time()
    
    latest_model = model_registry.load_latest_model()
    latest_model_path = model_registry.get_latest_model_path()
    
    if not latest_model:
        return {"error": "No global model available for prediction. Please complete at least one training round."}
        
    try:
        # Get expected features from model
        expected_features = latest_model.coef_.shape[1] if hasattr(latest_model, 'coef_') else 4
        
        # Initialize an array of zeros to match the model's exact expected shape
        features = np.zeros((1, expected_features))
        
        # Map the 4 UI inputs to the feature array safely
        # If it's the 11-feature heart disease dataset:
        if expected_features == 11:
            features[0, 0] = float(data.get("age", 45))
            features[0, 3] = float(data.get("bp", 120))
            features[0, 5] = 1 if float(data.get("glucose", 95)) > 120 else 0
            features[0, 4] = 220 # average cholesterol
            features[0, 6] = 150 # max heart rate
        elif expected_features >= 4:
            features[0, 0] = float(data.get("age", 45))
            features[0, 1] = float(data.get("bp", 120))
            features[0, 2] = float(data.get("glucose", 95))
            features[0, 3] = float(data.get("bmi", 24.5))
        else:
            features[0, 0] = float(data.get("age", 45))
            
        # Real inference
        prediction_class = latest_model.predict(features)[0]
        probabilities = latest_model.predict_proba(features)[0]
        
        confidence = probabilities[1] * 100 if prediction_class == 1 else probabilities[0] * 100
        result_label = "High Risk" if prediction_class == 1 else "Low Risk"
        
        # Calculate Mock SHAP using real model coefficients
        if hasattr(latest_model, 'coef_'):
            coef = latest_model.coef_[0]
            if expected_features == 11:
                c_age = abs(coef[0] * features[0, 0])
                c_bp = abs(coef[3] * features[0, 3])
                c_gluc = abs(coef[5] * features[0, 5])
                c_bmi = abs(coef[4] * features[0, 4])
            elif expected_features >= 4:
                c_age = abs(coef[0] * features[0, 0])
                c_bp = abs(coef[1] * features[0, 1])
                c_gluc = abs(coef[2] * features[0, 2])
                c_bmi = abs(coef[3] * features[0, 3])
            else:
                c_age, c_bp, c_gluc, c_bmi = 1, 1, 1, 1
                
            total_cont = c_age + c_bp + c_gluc + c_bmi + 1e-6
            shap_percentages = [c_age/total_cont, c_bp/total_cont, c_gluc/total_cont, c_bmi/total_cont]
        else:
            shap_percentages = [0.45, 0.30, 0.15, 0.10]
            
        shap_values = [
            {"name": "Age", "value": round(shap_percentages[0], 2)},
            {"name": "Blood Pressure", "value": round(shap_percentages[1], 2)},
            {"name": "Glucose", "value": round(shap_percentages[2], 2)},
            {"name": "BMI", "value": round(shap_percentages[3], 2)}
        ]
        
        inference_time = (time.time() - start) * 1000
        
        return {
            "prediction": result_label,
            "confidence": confidence,
            "probabilities": {"High Risk": round(probabilities[1]*100, 2), "Low Risk": round(probabilities[0]*100, 2)},
            "shap_values": shap_values,
            "inference_time_ms": round(inference_time, 2),
            "model_version": os.path.basename(latest_model_path) if latest_model_path else "v1.pkl",
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}
