# MediFed: Project Development Task Breakdown

This document outlines the complete end-to-end architecture and all tasks/sub-tasks executed during the development of the **MediFed Confidential Federated Learning** platform.

---

## 1. Core Backend Architecture & Database Layer
- **Environment Setup**: Configured Python 3.11 virtual environment, FastAPI, and Uvicorn.
- **Database Design**: Implemented SQLAlchemy SQLite database with schemas for:
  - `Hospital`: Node metadata, dataset status.
  - `LocalModelMetadata`: Local training metrics (accuracy, precision, recall, f1).
  - `ModelUpdateMetadata`: Extracted model deltas and sample sizes.
  - `GlobalModelMetadata`: Blockchain transaction references, global accuracy, and round IDs.

## 2. Dataset Management (Phase 1)
- **Ingestion Pipeline**: Created `DatasetManager` to securely receive CSV uploads from hospital nodes.
- **Advanced Metadata Extraction**: Utilized Pandas to compute dataset size, feature counts, class distribution, and missing values.
- **Data Integrity**: Implemented SHA-256 hashing for uploaded datasets.
- **Privacy Enforcement**: Enforced ephemeral storage (datasets are processed and immediately queued for deletion post-training).

## 3. Local Model Training (Phase 2)
- **ML Integration**: Integrated `scikit-learn` Logistic Regression as the baseline model.
- **Training Orchestration**: Built `LocalTrainer` to load local datasets, perform 80/20 train-test splits, and train models independently per hospital.
- **Metrics Computation**: Calculated accuracy, precision, recall, and F1-score.
- **Local Registry**: Saved serialized local models (`.pkl`) temporarily on disk.

## 4. Model Update Extraction (Phase 3)
- **Delta Computation**: Built `UpdateExtractor` to compare the newly trained Local Model against the current Global Model.
- **Parameter Extraction**: Extracted `weight_delta` and `bias_delta`.
- **Serialization**: Created a serializable `ModelUpdate` object containing deltas, hospital ID, and round metadata using `joblib`.

## 5. Local Differential Privacy (LDP) Layer (Phase 4)
- **Privacy Accountant**: Built `PrivacyService` to enforce DP guarantees prior to encryption.
- **L2 Norm Clipping**: Clipped weight and bias deltas to a predefined `clipping_norm` to bound individual sensitivity.
- **Gaussian Noise Injection**: Applied calibrated Gaussian noise scaled to the privacy budget (ε) and delta (δ).
- **Budget Tracking**: Maintained a running ε budget across federated rounds.

## 6. FHE Quantization & Validation (Phase 5)
- **Floating-Point Quantization**: Developed `QuantizationService` to convert float arrays into scaled integers (fixed-point arithmetic), a strict requirement for FHE computation.
- **Payload Validation**: Verified tensor dimensions, scaling factors, round IDs, and checksums before allowing data to leave the hospital node.

## 7. Fhenix Cryptographic Gateway (Phase 6)
- **Dual-Stack Bridge**: Built the `FhenixGateway` in Python to orchestrate communication with the TypeScript microservice.
- **JSON Serialization**: Transformed quantized Python objects into structured JSON payloads for the Node.js Fhenix SDK.

## 8. TypeScript Fhenix SDK Microservice (Phase 7)
- **Express.js Service**: Created an isolated Node.js server to handle Fhenix cryptographic operations.
- **Encryption**: Utilized `fhenixjs` to encrypt quantized integers into `euint32` and `euint64` ciphertexts.
- **Transaction Submission**: Used `ethers.js` to sign and broadcast transactions containing the encrypted payload to the fhEVM testnet.
- **Wallet Management**: Configured automated private key management and RPC provider connections for the Fhenix Helium network.

## 9. Confidential Smart Contract (Phase 8)
- **Solidity Development**: Wrote `MediFedAggregator.sol` using the `@fhenixprotocol/contracts` library.
- **FHE Arithmetic**: Implemented `FHE.add()` to perform homomorphic addition directly on encrypted ciphertexts.
- **Access Control**: Ensured only the designated coordinator address could trigger the global unsealing (`FHE.decrypt()`) of the aggregated model.
- **Provenance Logging**: Emitted smart contract events for immutability and audit trails.

## 10. Global Model Registry & Aggregation (Phase 9)
- **Coordinator Pipeline**: Handled the decrypted aggregated integers returning from fhEVM.
- **De-quantization**: Reversed the scaling factor to convert integers back into floating-point global deltas.
- **Global Update**: Applied the aggregated deltas to the previous global model weights.
- **Versioning**: Implemented immutable version control (`v1.pkl`, `v2.pkl`) in the `ModelRegistry`.

## 11. Inference Engine & Explainability (Phase 10)
- **Prediction Endpoint**: Created a real-time prediction service using the latest global model.
- **Probability Scoring**: Calculated binary classification confidence percentages.
- **SHAP Integration**: Generated Feature Importance (SHAP values) vectors for explainability (Age, Blood Pressure, Glucose, BMI).

## 12. Frontend Refactoring & UI Integration (Phase 11)
- **Zustand Mock Removal**: Stripped out all hardcoded state and mock data from the UI.
- **Axios Services**: Created strongly-typed API bindings (`src/api/services.ts`).
- **Server-Sent Events (SSE)**: Built a live event streamer (`stream.py`) in FastAPI and a custom `useSSE` React hook to push pipeline execution states to the UI without polling.
- **Recharts Integration**: Converted static UI blocks into dynamic `AreaChart` and `BarChart` visualizations for accuracy convergence, privacy budget, and SHAP explainability.
- **Live Workflows**: Wired the "Start Federated Training" button to trigger the backend orchestration background task and dynamically animate the 15-stage UI workflow.
- **Component Fixes**: Resolved critical React render crashes (e.g., handling missing global models gracefully, fixing missing `CartesianGrid` imports).
