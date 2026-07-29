# CivicEye - User & Administrator Manual

## 1. Citizen Mobile Application Guide
1. **Reporting a Complaint**:
   - Open the CivicEye Mobile App (or launch the interactive simulator on the dashboard).
   - Tap **Snap Photo** or choose an issue image preset (Pothole, Garbage, Water Leak, Sewage, etc.).
   - The AI automatically runs PyTorch inference, verifies issue authenticity, predicts category & confidence %, auto-detects GPS coordinates, and assigns the responsible department.
   - If an existing active complaint is detected within a 30-meter radius, a Duplicate Warning popup appears allowing you to track the existing issue.
   - Tap **Submit Complaint** to instantly notify the municipal control room.
2. **Real-Time Progress Tracking**:
   - Tap the **Track** tab to view your complaint's progress pipeline timeline: `Submitted -> Officer Notified -> Accepted -> Worker Assigned -> Work Completed -> Citizen Verified`.
3. **AI Assistant Chatbot**:
   - Tap the **AI Bot** tab to ask questions like *"Where is my complaint?"*, *"Resolution ETA?"*, or *"Emergency helpline"*.
4. **Voice Input & Rewards**:
   - Supports voice-to-text in English, Tamil (தமிழ்), and Hindi (हिन्दी).
   - Earn **15 Civic Points** for each verified report and unlock badges like **Civic Champion**!

## 2. Officer Web Dashboard Guide
1. **Officer Login**:
   - Log in using Officer credentials (`officer@civiceye.org` / `officer123`).
2. **Complaints Queue Management**:
   - View assigned complaints filtered by priority (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`) and status.
   - Click **Manage** on any complaint to:
     - **Accept Complaint**
     - **Assign Field Worker / Unit** (e.g., Worker Team Alpha)
     - **Upload Work Completion Photo (Before & After)**
     - **Update Status** to `WORK_COMPLETED` to notify citizen.

## 3. Administrator Dashboard Guide
1. **Overview & Analytics**:
   - View live KPI cards, resolution trends, category doughnut chart, and department efficiency bars.
2. **Spatial Map View**:
   - Interact with the Leaflet Map showing color-coded complaint markers (🔴 Pending, 🟡 In Progress, 🟢 Completed, 🔵 Verified) and 30-meter Haversine duplicate circles.
3. **Audit Export**:
   - Click **Export Audit CSV Report** to download complete complaint logs for municipal audits.
