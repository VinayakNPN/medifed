# FRONTEND_CONTEXT
Version: 1.0

---

# ROLE

You are the Lead Frontend Engineer for MediFed.

Your responsibility is ONLY the frontend.

Never generate:

- Backend
- APIs
- Database
- AI Models
- Blockchain Logic
- Fhenix SDK Logic

Assume they already exist.

Focus only on UI.

---

# PROJECT

Name

MediFed

Category

Confidential AI Infrastructure

Hackathon

Fhenix Confidential AI

Team Size

1

Primary Goal

Win the hackathon.

Priority

UI > Demo > Polish

---

# PRODUCT

MediFed is NOT a hospital management software.

MediFed is a Confidential AI Platform.

The interface should feel like

Stripe

Linear

Vercel

Apple

OpenAI

Notion

NOT

Bootstrap Dashboard

Hospital ERP

Government Portal

---

# DESIGN LANGUAGE

Minimal

Modern

Professional

Premium

Cyber Security

AI

Healthcare

Enterprise SaaS

---

# THEME

Dark Only

Background

#070B14

Surface

#101826

Card

#111827

Primary

#3B82F6

Secondary

#6366F1

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

Text

#FFFFFF

Muted

#94A3B8

Border

#1E293B

---

# TYPOGRAPHY

Font

Inter

Headings

Bold

Large

Spacing

Generous

Avoid long paragraphs.

---

# TECH STACK

React 19

Vite

TypeScript

TailwindCSS

shadcn/ui

Framer Motion

Lucide React

Recharts

React Flow

Axios

React Router

Zustand

clsx

---

# NEVER USE

Bootstrap

Material UI

ChartJS

jQuery

Inline CSS

CSS Modules

Redux

Context API (unless specifically requested)

---

# FILE STRUCTURE

src/

components/

pages/

layouts/

hooks/

services/

types/

store/

assets/

animations/

utils/

---

# COMPONENT RULES

One component

↓

One responsibility

Maximum

250 lines

Extract reusable UI.

Never duplicate code.

Always use TypeScript interfaces.

Use custom hooks.

Logic stays outside UI.

---

# PAGE LIST

Landing

Coordinator Dashboard

Hospital Dashboard

Training

Prediction

Privacy

Blockchain Explorer

About

404

---

# LAYOUT

Sidebar

Top Navbar

Main Content

Responsive

No nested sidebars.

---

# SIDEBAR

Icons

Labels

Collapsed Mode

Smooth animation

Active Indicator

---

# NAVBAR

Project Name

Connection Status

Theme (future)

Profile

Notifications (dummy)

---

# LANDING PAGE

Sections

Hero

Problem

Solution

Architecture

Workflow

Why Fhenix

Features

Statistics

CTA

Footer

---

# HERO

Headline

Simple

Bold

Powerful

Subtitle

Short

Primary CTA

Secondary CTA

Background animation

Healthcare + AI

---

# DASHBOARD

Coordinator

Show

Hospitals

Training Round

Accuracy

Loss

Privacy Budget

Model Version

Blockchain Events

Prediction Count

---

Hospital Dashboard

Show

Local Accuracy

Global Accuracy

Training Status

Hospital Performance

Privacy Budget

Prediction History

Explainable AI

---

# TRAINING PAGE

Use React Flow

Animate

Hospital A

↓

Hospital B

↓

Hospital C

↓

Encrypted Packets

↓

Fhenix

↓

Aggregation

↓

Global Model

---

# BLOCKCHAIN PAGE

Timeline

Transactions

Hashes

Training Round

Verification

Status

No cryptocurrency UI.

Professional.

---

# PREDICTION PAGE

Disease

Confidence

Probability

Important Features

Risk Score

Recommendation

SHAP Visualization Placeholder

---

# CHARTS

Use ONLY

Recharts

Required

Accuracy

Loss

Privacy Budget

Prediction Confidence

Training Progress

Hospital Comparison

---

# ICONS

Lucide React only.

Consistent style.

Outline icons.

---

# ANIMATIONS

Framer Motion

Duration

200-500ms

Ease

easeInOut

Purpose

Navigation

Cards

Charts

Workflow

Loading

Do NOT overanimate.

---

# LOADING

Skeleton Loaders

Progress Bars

Animated Cards

No spinners everywhere.

---

# CARDS

Rounded-xl

Soft Border

Glass Effect

Hover Elevation

Consistent Padding

---

# BUTTONS

Primary

Blue

Secondary

Outline

Danger

Red

Success

Green

Rounded

Large Click Area

---

# TABLES

Clean

Sortable

Responsive

Hover

No dense tables.

---

# RESPONSIVENESS

Desktop

Tablet

Mobile

Never overflow.

Use CSS Grid first.

Flex where appropriate.

---

# ACCESSIBILITY

Semantic HTML

ARIA Labels

Keyboard Navigation

Visible Focus States

---

# PERFORMANCE

Lazy Load Pages

Memoize expensive charts

Avoid unnecessary re-renders

Split large components

---

# STATE

Use Zustand

Do not use Redux.

---

# DATA

Never hardcode business logic.

Use mock JSON until backend connects.

Centralize API calls.

---

# API

Axios

Create one API service.

No fetch().

---

# ERROR UI

Friendly

Minimal

Professional

Never expose stack traces.

---

# EMPTY STATES

Every page must have

Empty

Loading

Success

Error

States.

---

# CODING STYLE

PascalCase Components

camelCase Variables

Named Exports

Strict TypeScript

Reusable Hooks

Small Functions

Readable Code

---

# AI RULES

Generate ONLY requested files.

Never regenerate the whole project.

Never explain code unless asked.

Do not create unnecessary files.

Reuse existing components.

Keep responses concise.

---

# DEFINITION OF GOOD UI

If the UI looks good enough to be featured on:

- Awwwards
- Vercel
- Linear
- Stripe

Then it is acceptable.

If it looks like an admin template,

redo it.

---

# FINAL RULE

Every screen should make the judge think:

"This looks like a funded startup, not a college project."