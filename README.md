# 🏛️ CivicEye — AI-Powered Smart Public Complaint Management System

![CivicEye](https://img.shields.io/badge/CivicEye-AI%20Powered-blueviolet?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.9+-blue?style=flat-square&logo=python)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?style=flat-square&logo=fastapi)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

> An industry-grade, scalable, end-to-end Smart Public Complaint Management System integrating **Artificial Intelligence** (Image Verification, 12-Class Classification, Priority Prediction, Duplicate Detection, Chatbot), **Mobile & Web Applications**, **Interactive Maps**, **Real-Time Tracking**, **Analytics Dashboards**, and **RESTful Microservices**.

---

## ✨ Key Features

### 🤖 AI Engine
- **Image Authenticity Verification** — Detects whether an uploaded photo is a genuine civic issue
- **12-Class Image Classification** — Road Damage, Pothole, Garbage, Street Light, Water Leakage, Open Drain, Illegal Dumping, Broken Traffic Signal, Fallen Tree, Public Toilet Damage, Sewage Overflow, Others
- **Priority & Department Prediction** — Auto-assigns severity (Critical/High/Medium/Low) and routes to the correct department
- **30-Meter Duplicate Detection** — Haversine geolocation math prevents duplicate complaints within 30m radius
- **AI Chatbot Assistant** — Natural language query support for complaint status, ETA, and reporting guidance

### 📊 Officer & Admin Dashboard (React)
- Real-time analytics with dynamic charts (Chart.js)
- Interactive complaint map with color-coded markers (Leaflet)
- Officer complaint management portal with status updates
- Admin control center for users, departments, and system settings
- Dark/Light theme with glassmorphism UI
- **23 Indian Languages** — Full multi-language support with RTL for Urdu, Sindhi, Kashmiri

### 📱 Citizen Mobile App Simulator
- Camera capture with AI classification visual feedback
- GPS geolocation auto-detection
- Real-time multi-stage tracking timeline
- Voice complaint (Speech-to-Text) preview
- QR Code verification generator
- Offline complaint saving & auto-sync

### 🔒 Authentication & Security
- JWT token-based authentication
- Role-based access control (CITIZEN, OFFICER, ADMIN)
- Per-user data isolation — new users see empty dashboards
- Bcrypt password hashing
- Email validation on sign-up

### 🎮 Gamification
- Citizen reward points and badges
- Civic Champion system for active reporters

---

## 🏗️ Architecture

```
civiceye/
├── backend/                  # Python FastAPI Backend API
│   ├── app/
│   │   ├── api/v1/          # REST Endpoints (Auth, Complaints, Officers, Admin, Analytics, Chatbot)
│   │   ├── core/            # Config, Security (JWT), Database Engine
│   │   ├── models/          # SQLAlchemy ORM Models (11 Tables)
│   │   ├── schemas/         # Pydantic Request/Response Schemas
│   │   └── services/        # AI Engine, Duplicate Detection, Analytics
│   ├── main.py              # FastAPI Entrypoint
│   └── requirements.txt
├── dashboard/                # React + Vite + Tailwind Web Dashboard
│   └── src/
│       ├── components/      # UI Components (9 modules)
│       ├── context/         # Auth & Theme Context Providers
│       └── services/        # API Client & Mock Data
├── docker/                   # Docker Containerization
│   ├── Dockerfile.backend
│   ├── Dockerfile.dashboard
│   └── docker-compose.yml
└── docs/                     # Project Documentation
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.9+

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/civiceye.git
cd civiceye
```

### 2. Start the Frontend Dashboard
```bash
cd dashboard
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```
The dashboard will be available at **http://localhost:3000**

### 3. Start the Backend API (Optional)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app/seed.py          # Populate test data
uvicorn main:app --host 0.0.0.0 --port 8000
```
The API docs will be available at **http://localhost:8000/docs**

---

## 🔑 Demo Accounts

| Role     | Email                   | Password      |
|----------|-------------------------|---------------|
| Admin    | admin@civiceye.org      | password123   |
| Officer  | officer@civiceye.org    | password123   |
| Citizen  | citizen@civiceye.org    | password123   |

Or sign up with any new email to create a fresh citizen account.

---

## 🗃️ Database Schema (11 Tables)

| Table             | Description                                    |
|-------------------|------------------------------------------------|
| Users             | All users with roles (Citizen/Officer/Admin)   |
| Departments       | Municipal departments with performance metrics |
| Officers          | Field officers linked to departments           |
| Complaints        | Core complaints with GPS, status, AI data      |
| ComplaintImages   | Before/After/Citizen uploaded images           |
| ComplaintHistory  | Full audit trail of status changes             |
| AIPredictions     | AI classification results per complaint        |
| Notifications     | Push notifications for users                   |
| Feedback          | Citizen satisfaction ratings                   |
| ChatMessages      | AI chatbot conversation logs                   |
| Locations         | Geographic zone mapping                        |

---

## 🌐 Multi-Language Support

Supports all **22 official languages of India** + English:

Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Maithili, Santali, Kashmiri, Nepali, Sindhi, Dogri, Konkani, Manipuri, Bodo, Sanskrit

With full **RTL (Right-to-Left)** support for Urdu, Sindhi, and Kashmiri.

---

## 🛠️ Tech Stack

| Layer      | Technology                              |
|------------|-----------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Chart.js  |
| Backend    | Python, FastAPI, SQLAlchemy, Pydantic   |
| Database   | SQLite (dev) / PostgreSQL + PostGIS     |
| AI         | Image Classification, NLP, Haversine    |
| Maps       | Leaflet.js with custom markers          |
| Auth       | JWT (python-jose), bcrypt (passlib)     |
| Deploy     | Docker, GitHub Actions CI/CD            |

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

Built as a **Final Year Engineering Project** — CivicEye: Empowering citizens, enabling governance, powered by AI.
