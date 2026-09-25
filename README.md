# MenstruAI – AI-Powered Menstrual Health Intelligence & Awareness Platform

> **Final-Year BTech Computer Science & Engineering Project**  
> **Milestone:** Phase 1 / Approximately 50% Core Foundation Implementation Completed.

---

## 1. Project Overview & Description

**MenstruAI** is an evidence-grounded, privacy-preserving menstrual health intelligence and awareness responsive web platform. While existing commercial applications often limit their functionality to period date estimations or commercialized tracking, MenstruAI is engineered around the core philosophy:

> *"An AI-powered menstrual health companion that helps users understand their health, not just track it."*

The application bridges the gap between passive calendar logging and active, informed bodily agency by synthesizing longitudinal observation tracking (symptoms, flow volume, mood states, sleep quality) with accredited clinical education, myth-busting repositories, health literacy self-assessments, and rule-based educational recommendations.

---

## 2. Problem Statement

* **Menstrual Health Illiteracy:** Millions of menstruating individuals receive inadequate education on reproductive endocrinology, leading to confusion between normal physiological variations and symptoms that require clinical attention.
* **Persistent Taboos & Misinformation:** Cultural stigmas and unverified online rumors perpetuate harmful practices (e.g., unnecessary hygiene douching, enduring debilitating dysmenorrhea in silence).
* **Passive Trackers:** Typical mobile period trackers harvest sensitive user data for advertising purposes without providing educational explanations or meaningful personal literacy growth.

---

## 3. Objectives

1. Provide an intuitive, responsive web application for logging menstrual observations (flow, cramps, headaches, fatigue, mood, sleep).
2. Maintain rigorous database user-isolation ensuring health data privacy.
3. Deliver evidence-based educational content compiled from international public health authorities (ACOG, WHO, NHS, Mayo Clinic).
4. Eliminate stigma through interactive Myth vs. Fact debunking with authoritative medical citations.
5. Offer interactive Health Literacy Quizzes with score computation, detailed feedback, and attempt history tracking.
6. Provide rule-based personalized educational recommendations that empower users without overstepping into medical diagnoses.
7. Establish an architectural foundation ready for Phase 2 Knowledge-Grounded Retrieval-Augmented Generation (RAG).

---

## 4. Technology Stack

### Frontend
* **Library / Framework:** React 19 + Vite
* **Styling & Design System:** Tailwind CSS (v4) with custom health-tech color palette
* **Routing:** React Router v7
* **Data Visualizations:** Recharts (responsive bar charts, pie/donut charts)
* **Icons:** Lucide React
* **HTTP Client:** Axios with JWT request/response interceptors

### Backend
* **Framework:** Python 3.13 + FastAPI (RESTful API architecture)
* **ORM:** SQLAlchemy 2.0
* **Data Validation & Schemas:** Pydantic v2 + Pydantic-Settings
* **Database Driver:** PyMySQL + Cryptography
* **Authentication & Cryptography:** Direct salted Bcrypt password hashing + PyJWT (HS256)
* **Testing:** Pytest + HTTPX TestClient

### Database
* **Database Engine:** MySQL 8.0 (Database name: `menstruai`)
* **Character Set:** `utf8mb4` with `utf8mb4_unicode_ci`

---

## 5. System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                 React SPA (Vite + Tailwind)                 │
│   Landing • Dashboard • Track • History • Analytics • Quiz  │
└──────────────────────────────┬──────────────────────────────┘
                               │ JSON / REST via Axios (JWT Bearer)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 FastAPI Modular Monolith                    │
│   Auth • Users • Tracking • Analytics • Education • Quiz   │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
               ▼                               ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│       SQLAlchemy ORM         │ │      Phase 2 Module         │
│   Session / Connection Pool  │ │ (RAG Interface / Vectors)   │
└──────────────┬───────────────┘ └─────────────────────────────┘
               │ PyMySQL Driver
               ▼
┌──────────────────────────────┐
│       MySQL 8.0 Server       │
│   menstruai relational schema│
└──────────────────────────────┘
```

---

## 6. Database Schema Design

The MySQL database `menstruai` contains 11 relational tables:

1. **`users`**: User identity, hashed passwords, roles (`USER`, `ADMIN`), active status, timestamps.
2. **`profiles`**: One-to-one user profile extension for preferences and goals.
3. **`privacy_consents`**: Explicit user privacy consent record (consent version, status, timestamp).
4. **`tracking_records`**: Cycle observations (start date, end date, flow, mood, sleep, notes).
5. **`symptoms`**: Predefined symptom catalogue (Cramps, Headache, Fatigue, Bloating, Mood Changes, Back Pain, Breast Tenderness).
6. **`record_symptoms`**: Many-to-many junction table associating tracking records with symptoms.
7. **`educational_content`**: 10 comprehensive educational articles categorized into Menstrual Health Basics, Hygiene, Common Symptoms, PMS, Nutrition, Sleep, and FAQs.
8. **`myths_facts`**: 9 evidence-based myth-debunking cards with facts, explanations, and citations.
9. **`quiz_questions`**: 10 multiple-choice questions testing cycle literacy.
10. **`quiz_options`**: 4 multiple-choice options per question with truth values.
11. **`quiz_attempts`**: Historical quiz attempts storing user score, total questions, and timestamps.

---

## 7. REST API Endpoints

### Authentication (`/api/v1/auth`)
* `POST /auth/register` – Register new user with password hashing and privacy consent.
* `POST /auth/login` – Authenticate user and issue JWT bearer token.
* `POST /auth/logout` – Invalidate active session.
* `GET  /auth/me` – Retrieve authenticated user identity.
* `POST /auth/forgot-password` – Generate password reset token.
* `POST /auth/reset-password` – Reset password using token.

### User Management (`/api/v1/users`)
* `GET    /users/me` – Retrieve user profile and privacy consent.
* `PUT    /users/me` – Update profile details.
* `DELETE /users/me` – Permanently delete user account and cascading data.

### Health Tracking (`/api/v1/tracking`)
* `GET    /tracking/symptoms` – Retrieve trackable symptoms catalogue.
* `POST   /tracking` – Create a health observation.
* `GET    /tracking` – List authenticated user's records.
* `GET    /tracking/{id}` – Get observation by ID (ownership verified).
* `PUT    /tracking/{id}` – Update observation (ownership verified).
* `DELETE /tracking/{id}` – Delete observation (ownership verified).

### Descriptive Analytics (`/api/v1/analytics`)
* `GET /analytics/summary` – Complete analytics summary with non-diagnostic factual statements.
* `GET /analytics/symptoms` – Frequency distribution of recorded symptoms.
* `GET /analytics/flow` – Breakdown of flow intensities.
* `GET /analytics/mood` – Frequency of recorded mood states.
* `GET /analytics/sleep` – Distribution of sleep observations.

### Health Education & Myths (`/api/v1/education`, `/api/v1/myths-facts`)
* `GET /education` – Retrieve articles (supports category filtering).
* `GET /education/{id}` – Retrieve article content by ID.
* `GET /myths-facts` – Retrieve all myth vs. fact cards.

### Literacy Quiz & History (`/api/v1/quiz`)
* `GET  /quiz` – Fetch quiz questions without answer leakage.
* `POST /quiz/submit` – Evaluate submission, save attempt, return breakdown.
* `GET  /quiz/history` – Retrieve user's quiz attempts and summary statistics.

### Recommendations (`/api/v1/recommendations`)
* `GET /recommendations` – Retrieve rule-based educational insights.

---

## 8. Folder Structure

```text
Mini_project_7th_sem/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   └── placeholder.py          # Phase 2 AI interfaces & safety filters
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── tracking.py
│   │   │   ├── analytics.py
│   │   │   ├── education.py
│   │   │   ├── myths_facts.py
│   │   │   ├── quiz.py
│   │   │   ├── recommendations.py
│   │   │   └── router.py
│   │   ├── auth/
│   │   │   ├── security.py             # Bcrypt hashing & verification
│   │   │   ├── jwt.py                  # Token issuance & decoding
│   │   │   └── dependencies.py         # Route guards & user extraction
│   │   ├── core/
│   │   │   └── config.py               # Pydantic BaseSettings & CORS
│   │   ├── database/
│   │   │   ├── base.py                 # Declarative Base
│   │   │   ├── session.py              # Engine & SessionLocal
│   │   │   └── init_db.py              # Schema generation & seed script
│   │   ├── models/                     # SQLAlchemy relational models
│   │   ├── rag/
│   │   │   └── placeholder.py          # Phase 2 RAG pipeline architecture
│   │   ├── schemas/                    # Pydantic v2 validation models
│   │   ├── services/                   # Business logic layer
│   │   └── main.py                     # FastAPI entry point
│   ├── tests/                          # Pytest automated test suite
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/                 # Navbar, Footer, Modal, StatCard, etc.
│   │   ├── context/                    # AuthContext
│   │   ├── pages/                      # Landing, Dashboard, Track, History, etc.
│   │   ├── services/                   # Axios API service modules
│   │   ├── App.jsx                     # Router config
│   │   ├── main.jsx
│   │   └── index.css                   # Tailwind v4 theme
│   ├── package.json
│   └── vite.config.js
│
├── knowledge_base/                     # Curated medical guidelines & RAG docs
│   └── README.md
├── venv/                               # Python virtual environment
├── .env.example
├── .gitignore
└── README.md
```

---

## 9. Installation & Setup Guide

### Prerequisites
* **Python:** 3.10+ (Tested on Python 3.13)
* **Node.js:** v18+ (Tested on Node v24)
* **MySQL:** MySQL Server 8.0+ running on port 3306

---

### Step 1: Database Setup
Ensure MySQL is running and create the database:
```sql
CREATE DATABASE IF NOT EXISTS menstruai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### Step 2: Backend Configuration & Startup
1. Open a terminal in the project root:
   ```powershell
   # Activate virtual environment
   .\venv\Scripts\Activate.ps1
   ```
2. Install Python packages (if not already installed):
   ```powershell
   pip install -r backend/requirements.txt
   ```
3. Run the FastAPI development server:
   ```powershell
   uvicorn app.main:app --reload --app-dir backend --port 8000
   ```
   * Interactive API Documentation (Swagger UI): `http://localhost:8000/api/v1/docs`
   * Health Check: `http://localhost:8000/api/health`

---

### Step 3: Frontend Configuration & Startup
1. Open a separate terminal and navigate to `frontend/`:
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
2. Open your web browser at:
   ```text
   http://localhost:5173
   ```

---

## 10. Demo Credentials for Project Review

For fast demonstration during review evaluations, a pre-seeded account is available:

* **Email:** `demo@menstruai.com`
* **Password:** `Password123!`

*(You can also use the one-click "Auto-fill Demo" button on the Login page, or register a new account via the Registration page).*

---

## 11. Automated Test Suite

Run the complete backend test suite using Pytest:
```powershell
.\venv\Scripts\pytest.exe backend/tests
```
**Results:** All 14 tests passing covering authentication, tracking CRUD, isolation, quiz grading, and factual analytics.

---

## 12. Project Status & Roadmap

### Completed in Phase 1 (First 50% Milestone)
* [x] Project setup & modular architecture
* [x] React 19 frontend with responsive Tailwind CSS design
* [x] FastAPI RESTful backend
* [x] MySQL database integration with SQLAlchemy ORM
* [x] User registration with privacy consent
* [x] Bcrypt password hashing & JWT authentication
* [x] Protected routes & user-data isolation
* [x] Dashboard with live stats & quick actions
* [x] Health observation logging form
* [x] Tracking history with view, edit, and delete confirmation
* [x] Descriptive analytics with interactive Recharts
* [x] 10 peer-reviewed educational articles with citations
* [x] 9 interactive Myth vs. Fact debunk cards
* [x] 10-question Health Literacy Quiz with grading & history
* [x] Rule-based personalized educational recommendations
* [x] User profile & account management
* [x] Automated test suite (14 tests passed)

### Planned for Phase 2 (Second 50% Milestone)
* [ ] **Knowledge-Grounded AI Assistant:** Conversational agent grounded in verified clinical guidelines.
* [ ] **RAG Pipeline:** Document chunking, embeddings, vector database indexing (ChromaDB / Qdrant).
* [ ] **Clinical Safety Guardrails:** Emergency triage and red-flag symptom detectors.
* [ ] **Advanced Personalized Pattern Discovery:** Cross-cycle statistical clustering.
* [ ] **Admin Knowledge CMS:** Dynamic article and quiz question management.
* [ ] **Production Deployment:** Containerization and cloud hosting.
