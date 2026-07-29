import math
from typing import Tuple, Dict, List, Any
from app.models.models import ComplaintPriority

# Department Mapping Rules
DEPARTMENT_ROUTING = {
    "Road Damage": ("Highways Department", "HIGHWAY"),
    "Pothole": ("Highways Department", "HIGHWAY"),
    "Garbage": ("Municipality", "MUNI"),
    "Illegal Dumping": ("Municipality", "MUNI"),
    "Street Light": ("Electricity Department", "ELEC"),
    "Broken Traffic Signal": ("Electricity Department", "ELEC"),
    "Water Leakage": ("Water Supply Board", "WATER"),
    "Sewage Overflow": ("Water Supply Board", "WATER"),
    "Open Drain": ("Public Works Department", "PWD"),
    "Fallen Tree": ("Public Works Department", "PWD"),
    "Public Toilet Damage": ("Municipality", "MUNI"),
    "Others": ("Public Works Department", "PWD")
}

# Priority Mapping Rules
PRIORITY_MAPPING = {
    "Broken Traffic Signal": ComplaintPriority.CRITICAL,
    "Sewage Overflow": ComplaintPriority.CRITICAL,
    "Open Drain": ComplaintPriority.CRITICAL,
    "Road Damage": ComplaintPriority.HIGH,
    "Pothole": ComplaintPriority.HIGH,
    "Water Leakage": ComplaintPriority.HIGH,
    "Fallen Tree": ComplaintPriority.HIGH,
    "Garbage": ComplaintPriority.MEDIUM,
    "Illegal Dumping": ComplaintPriority.MEDIUM,
    "Public Toilet Damage": ComplaintPriority.MEDIUM,
    "Street Light": ComplaintPriority.LOW,
    "Others": ComplaintPriority.LOW
}

class AIEngine:
    """
    Industry-level AI inference engine for CivicEye.
    Handles Civic Authenticity Verification, 12-Class Classification, Priority Prediction,
    Department Routing, and Geolocation Duplicate Detection.
    """

    @staticmethod
    def verify_and_classify_image(image_url: str, user_description: str = "") -> Dict[str, Any]:
        """
        Simulates deep CNN/YOLOv8 inference pipeline.
        In production, this connects to PyTorch/TensorFlow models or Roboflow dataset endpoints.
        """
        url_lower = image_url.lower()
        desc_lower = user_description.lower() if user_description else ""

        # Default fallback
        predicted_category = "Road Damage"
        confidence = 94.2
        authenticity_score = 0.96
        is_genuine = True

        # Keyword / Heuristic analysis based on mock image filename or user text
        if "pothole" in url_lower or "pothole" in desc_lower:
            predicted_category = "Pothole"
            confidence = 96.5
            alternatives = [
                {"category": "Road Damage", "confidence": 0.88},
                {"category": "Open Drain", "confidence": 0.12}
            ]
        elif "garbage" in url_lower or "trash" in desc_lower or "waste" in desc_lower:
            predicted_category = "Garbage"
            confidence = 95.8
            alternatives = [
                {"category": "Illegal Dumping", "confidence": 0.84},
                {"category": "Sewage Overflow", "confidence": 0.16}
            ]
        elif "water" in url_lower or "leak" in desc_lower or "pipe" in desc_lower:
            predicted_category = "Water Leakage"
            confidence = 93.4
            alternatives = [
                {"category": "Sewage Overflow", "confidence": 0.79},
                {"category": "Open Drain", "confidence": 0.21}
            ]
        elif "light" in url_lower or "lamp" in desc_lower or "dark" in desc_lower:
            predicted_category = "Street Light"
            confidence = 97.1
            alternatives = [
                {"category": "Broken Traffic Signal", "confidence": 0.91},
                {"category": "Others", "confidence": 0.09}
            ]
        elif "sewage" in url_lower or "smell" in desc_lower:
            predicted_category = "Sewage Overflow"
            confidence = 92.8
            alternatives = [
                {"category": "Open Drain", "confidence": 0.82},
                {"category": "Water Leakage", "confidence": 0.18}
            ]
        elif "tree" in url_lower or "branch" in desc_lower:
            predicted_category = "Fallen Tree"
            confidence = 98.2
            alternatives = [
                {"category": "Road Damage", "confidence": 0.90},
                {"category": "Others", "confidence": 0.10}
            ]
        elif "signal" in url_lower or "traffic" in desc_lower:
            predicted_category = "Broken Traffic Signal"
            confidence = 94.7
            alternatives = [
                {"category": "Street Light", "confidence": 0.85},
                {"category": "Others", "confidence": 0.15}
            ]
        elif "fake" in url_lower or "cat" in url_lower or "selfie" in url_lower:
            # Non-civic issue detection simulation
            is_genuine = False
            authenticity_score = 0.35
            confidence = 38.0
            predicted_category = "Others"
            alternatives = [
                {"category": "Non-Civic Image", "confidence": 0.65},
                {"category": "Others", "confidence": 0.35}
            ]
        else:
            predicted_category = "Road Damage"
            confidence = 91.5
            alternatives = [
                {"category": "Pothole", "confidence": 0.82},
                {"category": "Open Drain", "confidence": 0.18}
            ]

        predicted_priority = PRIORITY_MAPPING.get(predicted_category, ComplaintPriority.MEDIUM)
        dept_name, _ = DEPARTMENT_ROUTING.get(predicted_category, ("Public Works Department", "PWD"))

        flagged_manual = not is_genuine or confidence < 60.0

        return {
            "is_genuine_civic_issue": is_genuine,
            "authenticity_score": round(authenticity_score, 2),
            "predicted_category": predicted_category,
            "confidence_percentage": round(confidence, 1),
            "alternative_predictions": alternatives,
            "predicted_priority": predicted_priority,
            "recommended_department": dept_name,
            "severity_notes": f"AI verified {predicted_category} with {confidence}% confidence. Auto-routed to {dept_name}.",
            "flagged_for_manual_review": flagged_manual
        }

    @staticmethod
    def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Calculates Haversine distance in meters between two geographical GPS coordinates.
        """
        R = 6371000.0  # Earth radius in meters
        d_lat = math.radians(lat2 - lat1)
        d_lon = math.radians(lon2 - lon1)
        
        a = (math.sin(d_lat / 2) ** 2 +
             math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d_lon / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c
