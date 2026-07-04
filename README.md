# 🧬 MediFed: Confidential Federated Learning

<div align="center">
  <img src="https://img.shields.io/badge/Fhenix-CoFHE-blue?style=for-the-badge&logo=web3.js&logoColor=white" alt="Fhenix" />
  <img src="https://img.shields.io/badge/Opacus-Differential_Privacy-FF6F00?style=for-the-badge" alt="Opacus DP" />
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white" alt="Solidity" />
</div>
<br/>

> **The Future of Healthcare AI Doesn't Share Data. It Shares Intelligence.**
> MediFed is an end-to-end decentralized federated learning platform. We empower hospitals to collaboratively train clinical AI models using Local Differential Privacy and Fully Homomorphic Encryption (FHE) on the Fhenix Network. 

---

## 🌟 The Problem
Training highly accurate medical AI requires massive, diverse datasets. However, hospitals cannot share raw patient data due to stringent privacy regulations (HIPAA, GDPR) and data sovereignty risks. This results in data silos, biased models, and stunted medical innovation.

## 💡 The Solution: A Dual-Layer Privacy Architecture
MediFed solves this by combining two state-of-the-art cryptographic techniques:
1. **Local Differential Privacy (LDP):** Uses PyTorch/Opacus to clip gradients and inject calibrated Gaussian noise, bounding the privacy loss (ε) at the local hospital node.
2. **Confidential Fully Homomorphic Encryption (CoFHE):** Encrypts model updates using Fhenix before they leave the hospital. Smart contracts on the fhEVM aggregate these updates completely in ciphertext—ensuring zero data leakage during transit or aggregation.

## 🚀 Key Features
- **Zero Data Movement:** Patient data never leaves the hospital's local server. Only LDP-noised, FHE-encrypted model deltas are transmitted.
- **Trustless On-Chain Aggregation:** A custom Solidity smart contract (`MediFedAggregator.sol`) leverages `FHE.add()` to aggregate weights trustlessly without ever decrypting them.
- **Explainable AI (XAI):** Integrated SHAP (SHapley Additive exPlanations) values to provide clinicians with transparent, feature-level importance for every inference prediction.
- **Live Pipeline Streaming:** Real-time Server-Sent Events (SSE) push live state updates directly from the FastAPI orchestrator to the React frontend.
- **Dual-Stack Gateway:** Python ML backend communicates natively with a secure Node.js (fhenix.js) microservice for flawless tensor quantization and encryption.

---

## 🏗️ End-to-End Workflow & Architecture

1. **Local Training:** Hospitals ingest CSV datasets, train local models (Logistic Regression via scikit-learn), and extract weight/bias deltas.
2. **Differential Privacy:** The `PrivacyService` applies L2 norm clipping and injects noise.
3. **FHE Quantization:** Floating-point arrays are scaled to integers.
4. **Encryption & Submission:** The Node.js gateway uses `fhenixjs` to encrypt the payload into `euint32`/`euint64` and signs an ethers.js transaction to the fhEVM.
5. **Homomorphic Aggregation:** The Fhenix smart contract performs encrypted addition. 
6. **Global Unsealing:** The coordinator pulls the aggregated ciphertext, decrypts it, de-quantizes it, and produces the new Global Model `v{N+1}.pkl`.

---

## 🛠️ Comprehensive Tech Stack

### 🧠 Machine Learning & Backend
- **Python / FastAPI**: Core orchestration, dataset management, and SSE streaming.
- **Scikit-Learn / PyTorch / Opacus**: Model training, tensor extraction, and Differential Privacy accountant.
- **SQLite / SQLAlchemy**: Local node state and global registry.
- **SHAP**: Explainable AI prediction scoring.

### 🔒 Cryptography & Blockchain
- **Node.js / Express**: Cryptographic microservice.
- **fhenixjs / fhenix-hardhat-plugin**: FHE encryption and contract deployment.
- **Solidity / fhEVM**: Confidential smart contracts.
- **ethers.js**: Wallet management and transaction broadcasting.

### 💻 Frontend UI
- **React 19 + Vite (TypeScript)**
- **Tailwind CSS v4 + Framer Motion**: Glassmorphism UI and dynamic transitions.
- **Zustand**: Global state management.
- **Recharts + React Flow**: Live interactive training charts and node topology graphs.

---

## 🏁 Quick Start

### Prerequisites
- Node.js (v18+)
- Python 3.11+
- Fhenix Helium Testnet Faucet tokens

### 1. Setup the UI
```bash
cd medifed-fhenix  # or frontend folder
npm install
npm run dev
```

### 2. Setup the ML Backend
```bash
cd MediFed/backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Setup the Fhenix Gateway
```bash
cd MediFed/backend/fhenix_service
npm install
node server.js
```

---

## 📂 Project Structure
```text
MediFed/
├── backend/
│   ├── app/                # FastAPI ML Core (train, dp, extract, SSE)
│   ├── fhenix_service/     # Node.js gateway for encryption & tx signing
│   ├── fhenix_contracts/   # Hardhat project & Solidity Aggregator
│   └── data/               # Temporary ephemereal DBs and .pkl registries
├── frontend/               # React 19 UI (Dashboards, Charts, Workflows)
├── datasets/               # Sample clinical CSVs (Blood Pressure, BMI, etc.)
└── Specs/                  # Architectural deep dives & API specifications
```

---
<div align="center">
Built with 🩵 for a privacy-first healthcare future.
</div>
