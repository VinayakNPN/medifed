
# AGENTS.md
# MediFed - AI Project Operating Manual

## Mission
Build a polished, demo-ready MVP for a 12-hour Fhenix-sponsored hackathon.

**Primary Objective**
Win by demonstrating:
1. Confidential AI
2. Fhenix integration
3. Excellent UI/UX
4. Strong storytelling
5. Working end-to-end demo

---

# Project

Name: MediFed

Tagline:
Confidential AI Infrastructure for Healthcare

Problem:
Hospitals cannot share patient data, preventing collaborative AI.

Solution:
Confidential Federated Learning powered by Fhenix CoFHE.

---

# MVP Scope

Build ONLY:

- Landing Page
- Coordinator Dashboard
- Hospital Dashboard
- Federated Learning Simulation
- Differential Privacy Simulation
- Fhenix Workflow
- Blockchain Audit Visualization
- Prediction Page
- Explainability

DO NOT BUILD

- Authentication
- Payment
- Notifications
- Admin Portal
- Kubernetes
- Docker
- Redis
- Real distributed infrastructure

---

# Architecture

React Frontend

↓

FastAPI Backend

↓

Hospital Simulator

↓

Differential Privacy

↓

Fhenix Confidential Computation

↓

Aggregation

↓

Global Model

↓

Blockchain Audit

↓

Prediction

---

# Tech Stack

Frontend

- React 19
- Vite
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- React Router
- Zustand
- Axios
- Lucide React
- Recharts
- React Flow
- clsx
- class-variance-authority
- tailwind-merge

Backend

- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- Pydantic
- python-dotenv
- python-jose
- passlib
- bcrypt
- httpx
- requests

AI

- PyTorch
- Scikit-learn
- Pandas
- NumPy
- SHAP
- Opacus
- XGBoost (optional)

Security

- Cryptography

---

# Frontend Installation

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend

npm install react-router-dom axios zustand clsx
npm install framer-motion
npm install lucide-react
npm install recharts
npm install reactflow
npm install class-variance-authority tailwind-merge
npm install tailwindcss @tailwindcss/vite

npx shadcn@latest init
```

---

# Backend Installation

```bash
python -m venv .venv
```

Windows

```bash
.venv\Scripts\activate
```

Linux

```bash
source .venv/bin/activate
```

Install

```bash
pip install fastapi uvicorn
pip install sqlalchemy alembic aiosqlite
pip install pydantic python-dotenv
pip install python-jose passlib bcrypt
pip install httpx requests

pip install torch torchvision
pip install scikit-learn
pip install pandas numpy
pip install shap
pip install opacus
pip install cryptography
pip install matplotlib
pip install black isort pytest

# Optional
pip install xgboost
```

---

# Fhenix

Clone official examples.

Use official SDK.

Do not invent integration.

Use Fhenix for

- Encrypted Aggregation
- Confidential Inference
- Encrypted Model Updates

Mention Fhenix throughout the demo.

---

# Database

SQLite

Tables

- hospitals
- training_rounds
- model_versions
- predictions
- privacy_budgets
- audit_logs
- blockchain_events

Never store patient data.

---

# APIs

GET /dashboard

POST /training/start

GET /training/status

POST /prediction

GET /prediction/history

GET /privacy

GET /audit

GET /blockchain/events

---

# Folder Structure

frontend/

backend/

datasets/

assets/

README.md

AGENTS.md

---

# UI Style

Premium SaaS

References

- Stripe
- Vercel
- Linear
- OpenAI

Dark Theme

Minimal

Modern

Professional

Never use Bootstrap.

Never use Material UI.

---

# Charts

Only Recharts

Required

- Accuracy
- Loss
- Privacy Budget
- Training Progress
- Hospital Comparison
- Confidence

---

# Icons

Lucide React

---

# Animation

Framer Motion

200–500ms

Subtle

Professional

---

# AI Pipeline

Synthetic Dataset

↓

Split

↓

Hospital A

Hospital B

Hospital C

↓

Local Training

↓

Differential Privacy

↓

Encrypted Updates

↓

Fhenix

↓

Aggregation

↓

Global Model

↓

Prediction

↓

Explainability

---

# Development Order

1. Project setup
2. Landing Page
3. Dashboard
4. Backend APIs
5. Hospital Simulator
6. Federated Learning
7. Privacy Layer
8. Fhenix Integration
9. Blockchain Visualization
10. Prediction
11. Polish
12. Presentation

---

# AI Rules

Always generate ONLY requested files.

Never regenerate the entire project.

Never modify unrelated files.

Keep components modular.

Use TypeScript.

Use FastAPI.

Reuse components.

Prefer hooks.

Do not explain code unless requested.

---

# Judge Priorities

Emphasize

- Confidential AI
- Fhenix
- Privacy
- Explainability
- Beautiful UI

The story matters more than algorithm complexity.

---

# Golden Rule

Every feature should answer:

"Does this increase our chance of winning the hackathon?"

If not, don't build it.
