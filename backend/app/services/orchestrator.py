import asyncio
import random
import uuid
from datetime import datetime
from typing import List, Dict, Any

class TrainingOrchestrator:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TrainingOrchestrator, cls).__new__(cls)
            cls._instance.reset()
        return cls._instance

    def reset(self):
        self.state = "IDLE"
        self.round = 1
        self.global_accuracy = 0.0
        self.privacy_budget = 1.02
        self.fhenix_stage = 0
        self.logs: List[Dict[str, Any]] = []
        self.hospitals = []
        self.is_running = False

    def add_log(self, message: str, type: str = "info"):
        self.logs.insert(0, {
            "id": str(uuid.uuid4()),
            "time": datetime.now().strftime("%H:%M:%S"),
            "message": message,
            "type": type
        })
        self.logs = self.logs[:15]

    async def _run_simulation(self):
        from app.db.session import SessionLocal
        from app.models.domain import Hospital
        from app.services.trainer import local_trainer
        from app.services.coordinator import coordinator_service
        import joblib
        import os
        
        self.is_running = True
        db = SessionLocal()
        
        db_hospitals = db.query(Hospital).all()
        self.hospitals = []
        for h in db_hospitals:
            self.hospitals.append({
                "id": h.id,
                "name": h.name,
                "status": "Waiting",
                "progress": 0,
                "accuracy": 0.0,
                "dataset_size": h.dataset_size if h.has_dataset else "No Dataset",
                "has_dataset": h.has_dataset
            })
            
        self.add_log(f"Initiating True Federated Training Round {self.round}", "info")
        
        # Phase 1: Local Training
        active_hospitals = [h for h in self.hospitals if h["has_dataset"]]
        
        if not active_hospitals:
            self.add_log("No hospitals have datasets ready.", "warning")
            self.state = "IDLE"
            self.is_running = False
            db.close()
            return

        for idx, h_state in enumerate(active_hospitals):
            self.state = "Training Started"
            h_state["status"] = "Training"
            self.add_log(f"{h_state['name']} computing gradients on real data...", "info")
            
            # Run the synchronous ML training in a separate thread so we don't block the asyncio event loop!
            try:
                def run_training_in_thread(hid):
                    from app.db.session import SessionLocal
                    local_db = SessionLocal()
                    try:
                        return local_trainer.train_model(hid, local_db)
                    finally:
                        local_db.close()
                        
                result = await asyncio.to_thread(run_training_in_thread, h_state["id"])
                h_state["accuracy"] = round(result["metrics"]["accuracy"] * 100, 2)
            except Exception as e:
                self.add_log(f"Error training {h_state['name']}: {str(e)}", "warning")
                h_state["status"] = "Error"
                continue
            
            # Simulate progress for UI purely for visuals
            for p in [25, 50, 75, 100]:
                h_state["progress"] = p
                await asyncio.sleep(0.2)
                
            h_state["status"] = "Completed"
            self.state = "Local Model Finished"
            self.add_log(f"{h_state['name']} local epoch done. Acc: {h_state['accuracy']}%", "success")
            
        self.state = "Model Update Extracted"
        await asyncio.sleep(0.5)
        self.state = "Differential Privacy Applied"
        await asyncio.sleep(0.5)
        self.state = "Quantization Completed"
        await asyncio.sleep(0.5)
        self.state = "Payload Validated"
        await asyncio.sleep(0.5)
        
        self.state = "Submitting To Fhenix"
        self.add_log("Sending encrypted updates to Fhenix Node...", "warning")
        
        # Phase 2: Fhenix Aggregation
        self.state = "Confidential Computation Running"
        self.add_log("Executing Confidential Aggregation on fhEVM", "info")
        
        DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "hospitals")
        
        for stage in range(1, 5):
            self.fhenix_stage = stage
            await asyncio.sleep(1.0)
            
        self.state = "Confidential Aggregation Complete"
        
        self.state = "Coordinator Validation"
        final_accuracy = self.global_accuracy
        
        for h_state in active_hospitals:
            if h_state["status"] == "Error": continue
            update_path = os.path.join(DATA_DIR, str(h_state["id"]), "model_update.pkl")
            if os.path.exists(update_path):
                quantized_update = joblib.load(update_path)
                try:
                    res = coordinator_service.process_hospital_update(quantized_update, db)
                    if res["status"] == "published":
                        final_accuracy = res["metrics"]["accuracy"] * 100
                        self.add_log(f"Merged {h_state['name']} update. Tx: {res['fhenix_tx'][:10]}...", "success")
                    else:
                        self.add_log(f"Rejected {h_state['name']} update: {res.get('reason')}", "warning")
                except Exception as e:
                    self.add_log(f"Error processing {h_state['name']} update: {e}", "warning")
                    
        self.state = "Global Model Updated"
        self.global_accuracy = round(final_accuracy, 2)
        await asyncio.sleep(1.0)
        
        self.state = "Model Evaluation"
        await asyncio.sleep(1.0)
        self.state = "Model Published"
        await asyncio.sleep(1.0)
        
        self.state = "Hospitals Synchronizing"
        await asyncio.sleep(1.0)
        
        self.state = "Training Complete"
        self.round += 1
        self.privacy_budget -= 0.05
            
        self.add_log("Ready for Inference", "success")
        self.is_running = False
        db.close()

    def start_simulation(self):
        if not self.is_running:
            asyncio.create_task(self._run_simulation())
        
    def get_state(self):
        return {
            "sim_state": self.state,
            "round": self.round,
            "global_accuracy": self.global_accuracy,
            "privacy_budget": round(self.privacy_budget, 2),
            "fhenix_stage": self.fhenix_stage,
            "hospitals": self.hospitals,
            "logs": self.logs
        }

orchestrator = TrainingOrchestrator()
