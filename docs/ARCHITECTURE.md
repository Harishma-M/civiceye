# CivicEye - System Architecture & Technical Specifications

## 1. System Overview
CivicEye is an enterprise-grade, scalable, AI-powered Smart Public Complaint Management System. It bridges the gap between citizens reporting municipal infrastructure issues and government departments resolving them efficiently.

```
+-------------------------------------------------------------------------------+
|                               CITIZEN INTERFACE                               |
|  Flutter Mobile Application & Responsive Web Simulator (Voice / Camera / GPS) |
+---------------------------------------+---------------------------------------+
                                        | REST API (HTTPS / JWT)
                                        v
+-------------------------------------------------------------------------------+
|                               FASTAPI BACKEND                                 |
|  - Auth & Role Middleware (Citizen, Officer, Admin)                           |
|  - Haversine Geolocation Engine (30m Duplicate Detection)                    |
|  - Analytics & Audit Report Exporter                                          |
+-------------------+-----------------------------------+-----------------------+
                    |                                   |
                    v                                   v
+---------------------------------------+   +-----------------------------------+
|               AI ENGINE               |   |        DATABASE LAYER             |
| - PyTorch 12-Class CNN & YOLOv8       |   | - PostgreSQL 15 + PostGIS         |
| - Issue Authenticity Verifier         |   | - SQLite (Zero-config local mode) |
| - Priority & SLA Predictor            |   | - 11 Interconnected Tables        |
| - Contextual NLP Chatbot              |   +-----------------------------------+
+---------------------------------------+
                    |
                    v REST API (JSON / WebSockets)
+-------------------------------------------------------------------------------+
|                           WEB DASHBOARD INTERFACE                             |
|  React 18 + Tailwind CSS + Chart.js + Leaflet Interactive Spatial Map        |
+-------------------------------------------------------------------------------+
```

## 2. Component Details
1. **Citizen Mobile & Web Client**: Built with Flutter (Dart) and React Web Simulator. Supports camera photo capture, speech-to-text voice input, auto-GPS geolocation, 30m duplicate notification, and real-time tracking timeline.
2. **AI Inference Pipeline**:
   - **Authenticity Verifier**: Validates if photo contains genuine civic infrastructure issue vs non-civic objects.
   - **12-Class Image Classifier**: Road Damage, Pothole, Garbage, Street Light, Water Leakage, Open Drain, Illegal Dumping, Broken Traffic Signal, Fallen Tree, Public Toilet Damage, Sewage Overflow, Others.
   - **Priority & SLA Rules Engine**: Predicts Critical (6-12h), High (12-24h), Medium (24-48h), Low (48-72h).
3. **FastAPI Microservice Engine**: Asynchronous Python API providing REST endpoints for Authentication, Complaints lifecycle, Officers portal, Admin settings, Analytics, and Chatbot.
4. **Interactive Spatial Dashboard**: Leaflet GIS map with color-coded markers (🔴 Pending, 🟡 In Progress, 🟢 Completed, 🔵 Verified), Chart.js trends, and audit export.
