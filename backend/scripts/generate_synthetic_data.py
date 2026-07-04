import os
import numpy as np
import pandas as pd

def generate_hospital_data(num_samples: int, file_path: str):
    # Set seed for reproducibility
    np.random.seed(int(os.urandom(4).hex(), 16))
    
    # Features
    # 1. Age (20 to 80)
    age = np.random.normal(50, 15, num_samples)
    age = np.clip(age, 20, 80)
    
    # 2. Blood Pressure (90 to 180)
    bp = np.random.normal(120, 15, num_samples)
    bp = np.clip(bp, 90, 180)
    
    # 3. Glucose Level (70 to 200)
    glucose = np.random.normal(100, 25, num_samples)
    glucose = np.clip(glucose, 70, 200)
    
    # 4. BMI (18.5 to 40)
    bmi = np.random.normal(26, 4, num_samples)
    bmi = np.clip(bmi, 18.5, 40)
    
    # Let's create a linear relationship for risk
    # High Risk = 1, Low Risk = 0
    # Coefficients: Age(0.05), BP(0.03), Glucose(0.04), BMI(0.1)
    # intercept = -15
    logits = (age * 0.05) + (bp * 0.03) + (glucose * 0.04) + (bmi * 0.1) - 13.5
    
    # Add some noise
    logits += np.random.normal(0, 1.5, num_samples)
    
    # Sigmoid to probability
    probabilities = 1 / (1 + np.exp(-logits))
    
    # Convert to binary label
    risk_label = (probabilities > 0.5).astype(int)
    
    df = pd.DataFrame({
        'Age': np.round(age, 1),
        'Blood_Pressure': np.round(bp, 1),
        'Glucose_Level': np.round(glucose, 1),
        'BMI': np.round(bmi, 1),
        'Risk_Label': risk_label
    })
    
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    df.to_csv(file_path, index=False)
    print(f"Generated {num_samples} samples at {file_path}")
    print(f"Class Distribution: {df['Risk_Label'].value_counts().to_dict()}\n")

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(__file__))
    sample_data_dir = os.path.join(base_dir, "data", "sample_csvs")
    
    # Generate 3 distinct datasets for our 3 hospitals
    generate_hospital_data(2500, os.path.join(sample_data_dir, "hospital_A_cardiology.csv"))
    generate_hospital_data(1800, os.path.join(sample_data_dir, "hospital_B_oncology.csv"))
    generate_hospital_data(3200, os.path.join(sample_data_dir, "hospital_C_neurology.csv"))
