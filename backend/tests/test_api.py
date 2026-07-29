import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "HEALTHY"

def test_ai_classification_endpoint():
    response = client.post("/api/v1/complaints/check-ai?image_url=https://example.com/pothole.jpg&description=hazardous+road+pothole")
    assert response.status_code == 200
    data = response.json()
    assert data["is_genuine_civic_issue"] is True
    assert data["predicted_category"] in ["Pothole", "Road Damage"]
    assert data["confidence_percentage"] > 80.0
    assert data["predicted_priority"] in ["HIGH", "CRITICAL"]

def test_duplicate_detection_haversine():
    # Coordinates near Anna Salai (13.0827, 80.2707) within 30m
    payload = {
        "latitude": 13.0827,
        "longitude": 80.2707,
        "category": "Pothole"
    }
    response = client.post("/api/v1/complaints/check-duplicate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "is_duplicate" in data

def test_analytics_dashboard_endpoint():
    response = client.get("/api/v1/analytics/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["total_complaints"] >= 6
    assert "category_distribution" in data
    assert "heatmap_data" in data
    assert len(data["department_performance"]) >= 5

def test_system_status():
    response = client.get("/api/v1/admin/departments")
    assert response.status_code == 200
    assert len(response.json()) >= 5
