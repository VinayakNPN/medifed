# MediFed
## AI Operating Manual
### Version 1.0

---

# 🚨 READ THIS FIRST

If you are an AI coding assistant working on this project, read this document completely before generating any code.

This document contains the official project context, architecture decisions, coding standards, priorities, implementation roadmap and development constraints.

Do NOT make assumptions that contradict this document.

---

# Project Identity

Project Name

MediFed

Tagline

Confidential Federated AI Infrastructure for Healthcare

Category

AI
Healthcare
Privacy
Blockchain
Confidential Computing

Hackathon

Fhenix Confidential AI Hackathon

Sponsor

Fhenix

Primary Goal

Build a production-quality MVP demonstrating Confidential Federated Learning using Fhenix CoFHE.

Duration

12 Hours

Team Size

1 Developer

---

# Mission

Hospitals cannot legally share patient records.

Without collaboration,

AI cannot learn enough to accurately diagnose rare diseases.

MediFed enables hospitals to collaboratively train AI models without sharing patient data.

The project demonstrates that intelligence can be shared without exposing information.

---

# Project Vision

Create the world's most trusted privacy-preserving AI collaboration platform.

Rare Disease Diagnosis is only the first application.

Future applications include

- Cancer Detection
- Medical Imaging
- Drug Discovery
- Clinical Research
- Genomics
- Personalized Medicine

Think of MediFed as

"GitHub for Medical Intelligence"

instead of

"Another Diagnosis App"

---

# Core Innovation

Traditional AI

Data

↓

Server

↓

Training

↓

Privacy Risk

MediFed

Data

↓

Local Training

↓

Encrypted Learning

↓

Fhenix CoFHE

↓

Global Intelligence

↓

Blockchain Audit

↓

Diagnosis

---

# Sponsor Priority

The hackathon sponsor is Fhenix.

This project MUST demonstrate meaningful usage of Fhenix.

Never treat Fhenix as an additional feature.

Instead,

Fhenix is the core trust layer.

Whenever possible,

show encrypted computation instead of talking about it.

---

# Current Status

Project Phase

Preparation

Frontend

Not Started

Backend

Not Started

AI

Not Started

Fhenix

Research Completed

Dashboard

Design Phase

Presentation

Not Started

Deployment

Localhost

---

# Development Philosophy

Prioritize

1. Demo

2. User Experience

3. Fhenix

4. AI

5. Architecture

6. Code Quality

Do NOT over-engineer.

A polished demo is more valuable than unfinished features.

---

# MVP Scope

The MVP should include

✓ Landing Page

✓ Hospital Dashboard

✓ Coordinator Dashboard

✓ Federated Learning Simulation

✓ Differential Privacy

✓ Fhenix Confidential Computation

✓ Blockchain Audit Trail

✓ Explainable AI

✓ Diagnosis Screen

---

# Explicitly Out of Scope

Do NOT build

Patient Authentication

Payment System

Notifications

Hospital ERP

Role Management

Real Medical Database

Real Federated Infrastructure

Production Deployment

Mobile Application

Admin Portal

Cloud Infrastructure

Kubernetes

Microservices

Focus only on what wins the demo.

---

# Technology Stack

Frontend

React

Vite

TailwindCSS

shadcn/ui

Framer Motion

React Flow

Recharts

Axios

Backend

FastAPI

SQLAlchemy

SQLite

Pydantic

JWT

AI

PyTorch

Flower

Scikit

SHAP

Opacus

Pandas

NumPy

Blockchain

Fhenix CoFHE

Cryptography

---

# Folder Structure

frontend/

backend/

ai/

blockchain/

assets/

specs/

scripts/

datasets/

tests/

---

# AI Architecture

Three simulated hospitals.

Hospital A

Hospital B

Hospital C

Each hospital

↓

Local Dataset

↓

Local Training

↓

Differential Privacy

↓

Encrypted Update

↓

Fhenix

↓

Secure Aggregation

↓

Global Model

↓

Prediction

---

# Security Principles

Patient data NEVER leaves hospital.

Only encrypted gradients travel.

Fhenix performs confidential computation.

Blockchain stores metadata only.

No Protected Health Information is stored centrally.

---

# Frontend Pages

Landing

Coordinator Dashboard

Hospital Dashboard

Training Simulation

Diagnosis

Prediction History

Privacy Analytics

Blockchain Explorer

About

---

# Backend Modules

Authentication

Hospitals

Federation

Privacy

AI

Predictions

Dashboard

Fhenix

Blockchain

Shared

---

# Dashboard KPIs

Hospitals Connected

Training Round

Model Accuracy

Loss

Privacy Budget

Encrypted Operations

Blockchain Transactions

Prediction Count

Average Confidence

---

# Explainable AI

Every prediction should explain

Confidence

Symptoms

Feature Importance

Risk Score

Important Biomarkers

Doctors should understand WHY.

---

# Demo Story

A patient has symptoms that no hospital alone can confidently diagnose.

Three hospitals collaborate.

Patient records never move.

Only encrypted intelligence moves.

Fhenix enables confidential computation.

The global model improves.

The doctor receives an explainable diagnosis.

Blockchain proves the training occurred.

---

# Judging Priorities

Demonstrate

Working AI

Privacy

Sponsor Technology

Good UI

Real Problem

Clear Architecture

Do NOT waste time implementing features judges will never see.

---

# Time Allocation

Hour 1

Project Setup

Hour 2

Frontend Skeleton

Hour 3

Backend APIs

Hour 4

Federated Learning Simulation

Hour 5

Differential Privacy

Hour 6

Fhenix

Hour 7

Dashboard

Hour 8

Prediction

Hour 9

Blockchain

Hour 10

Integration

Hour 11

Presentation

Hour 12

Buffer

---

# AI Instructions

Always generate modular code.

Never generate monolithic files.

Prefer reusable components.

Always use TypeScript in frontend.

Backend must use FastAPI.

Never replace technologies.

Keep functions under 50 lines whenever practical.

Never hardcode secrets.

Prefer configuration files.

Use descriptive variable names.

Always write clean code.

---

# Prompting Rules

When generating code,

only generate the requested module.

Do not generate the entire project.

Keep responses concise.

Avoid unnecessary explanation.

Optimize for implementation speed.

---

# Success Criteria

The project succeeds if the judges understand

The Problem

↓

The Solution

↓

The Technology

↓

The Innovation

↓

The Sponsor Integration

↓

The Demo

within five minutes.

---

# Elevator Pitch

MediFed is a confidential federated AI platform that enables hospitals to collaboratively train rare disease diagnostic models while patient data never leaves institutional boundaries.

Using Federated Learning, Differential Privacy and Fhenix CoFHE, encrypted model updates are securely aggregated into a global intelligence model without exposing sensitive medical information.

Every training round is transparently verified through blockchain-backed audit logs, creating a trustworthy and privacy-preserving AI ecosystem for healthcare.

---

# Golden Rule

Every coding decision should answer one question:

"Will this increase our chances of winning tomorrow?"

If not,

don't build it.

---

# Next Document

Read

01_ARCHITECTURE.md

before writing any code.