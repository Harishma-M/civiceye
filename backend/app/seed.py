import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import Base, engine, SessionLocal
from app.core.security import get_password_hash
from app.models.models import (
    User, Department, Officer, Complaint, ComplaintImage, 
    ComplaintHistory, AIPrediction, Feedback, UserRole, 
    ComplaintPriority, ComplaintStatusEnum, ImageTypeEnum
)
from app.services.ai_engine import AIEngine

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(User).first():
        print("Database already seeded!")
        db.close()
        return

    print("Seeding CivicEye database with initial production mock data...")

    # 1. Seed Departments
    departments_data = [
        {"name": "Highways Department", "code": "HIGHWAY", "contact_email": "highways@civiceye.org", "contact_phone": "044-2456-1100", "head_officer_name": "Er. Rajesh Kumar"},
        {"name": "Municipality", "code": "MUNI", "contact_email": "municipality@civiceye.org", "contact_phone": "044-2834-9900", "head_officer_name": "Dr. Ananya Sharma"},
        {"name": "Water Supply Board", "code": "WATER", "contact_email": "watersupply@civiceye.org", "contact_phone": "1916", "head_officer_name": "Er. Suresh V"},
        {"name": "Electricity Department", "code": "ELEC", "contact_email": "electricity@civiceye.org", "contact_phone": "1912", "head_officer_name": "Er. Vikramaditya"},
        {"name": "Public Works Department", "code": "PWD", "contact_email": "pwd@civiceye.org", "contact_phone": "044-2533-8822", "head_officer_name": "Er. Meena Sundaram"}
    ]

    depts = {}
    for d in departments_data:
        dept = Department(**d)
        db.add(dept)
        db.flush()
        depts[d["code"]] = dept

    # 2. Seed Users
    hashed_pwd_citizen = get_password_hash("citizen123")
    hashed_pwd_officer = get_password_hash("officer123")
    hashed_pwd_admin = get_password_hash("admin123")

    user_citizen = User(
        email="citizen@civiceye.org",
        hashed_password=hashed_pwd_citizen,
        full_name="Priya Ramesh",
        phone="9876543210",
        role=UserRole.CITIZEN,
        profile_image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        reward_points=120,
        badge="Civic Champion"
    )
    user_officer = User(
        email="officer@civiceye.org",
        hashed_password=hashed_pwd_officer,
        full_name="Inspector K. Arumugam",
        phone="9840123456",
        role=UserRole.OFFICER,
        profile_image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    )
    user_admin = User(
        email="admin@civiceye.org",
        hashed_password=hashed_pwd_admin,
        full_name="System Administrator",
        phone="9000000000",
        role=UserRole.ADMIN,
        profile_image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
    )

    db.add_all([user_citizen, user_officer, user_admin])
    db.flush()

    # 3. Seed Officer Profile
    officer_profile = Officer(
        user_id=user_officer.id,
        department_id=depts["HIGHWAY"].id,
        employee_id="OFF-HWY-904",
        badge_number="BDG-4402",
        designation="Senior Executive Engineer",
        is_available=True
    )
    db.add(officer_profile)
    db.flush()

    # 4. Seed Complaints across categories with Geolocation & Images
    seed_complaints = [
        {
            "tracking_code": "CIV-2026-1001",
            "title": "Severe Pothole on Main Arterial Road",
            "desc": "Deep hazardous pothole causing traffic slowdown and two-wheeler accidents.",
            "category": "Pothole",
            "priority": ComplaintPriority.CRITICAL,
            "status": ComplaintStatusEnum.IN_PROGRESS,
            "lat": 13.0827, "lng": 80.2707, "address": "Anna Salai, Near Mount Road Flyover",
            "dept": depts["HIGHWAY"],
            "image": "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600",
            "zone": "Central Zone"
        },
        {
            "tracking_code": "CIV-2026-1002",
            "title": "Overflowing Garbage Dumpster",
            "desc": "Garbage hasn't been collected for 4 days creating health hazard.",
            "category": "Garbage",
            "priority": ComplaintPriority.MEDIUM,
            "status": ComplaintStatusEnum.SUBMITTED,
            "lat": 13.0850, "lng": 80.2750, "address": "Block 4, Park Road",
            "dept": depts["MUNI"],
            "image": "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600",
            "zone": "North Zone"
        },
        {
            "tracking_code": "CIV-2026-1003",
            "title": "Water Pipeline Burst & Road Leakage",
            "desc": "High pressure clean water leaking onto main road causing wastage.",
            "category": "Water Leakage",
            "priority": ComplaintPriority.HIGH,
            "status": ComplaintStatusEnum.ACCEPTED,
            "lat": 13.0780, "lng": 80.2650, "address": "7th Cross Street, Lake View Area",
            "dept": depts["WATER"],
            "image": "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600",
            "zone": "East Zone"
        },
        {
            "tracking_code": "CIV-2026-1004",
            "title": "Non-functional Street Light Junction",
            "desc": "Entire street light line is off creating dark dangerous zone at night.",
            "category": "Street Light",
            "priority": ComplaintPriority.LOW,
            "status": ComplaintStatusEnum.WORK_COMPLETED,
            "lat": 13.0900, "lng": 80.2800, "address": "Gandhi Road, Zone 2",
            "dept": depts["ELEC"],
            "image": "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600",
            "zone": "West Zone"
        },
        {
            "tracking_code": "CIV-2026-1005",
            "title": "Hazardous Open Sewage Drain",
            "desc": "Uncovered drain slab near school entrance. Very dangerous for children.",
            "category": "Sewage Overflow",
            "priority": ComplaintPriority.CRITICAL,
            "status": ComplaintStatusEnum.WORKER_ASSIGNED,
            "lat": 13.0810, "lng": 80.2720, "address": "School Road, Block C",
            "dept": depts["WATER"],
            "image": "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=600",
            "zone": "South Zone"
        },
        {
            "tracking_code": "CIV-2026-1006",
            "title": "Fallen Tree Branch Blocking Highway",
            "desc": "Large banyan tree branch broke in heavy storm and blocked left lane.",
            "category": "Fallen Tree",
            "priority": ComplaintPriority.HIGH,
            "status": ComplaintStatusEnum.CITIZEN_VERIFIED,
            "lat": 13.0870, "lng": 80.2680, "address": "National Highway Junction",
            "dept": depts["PWD"],
            "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600",
            "zone": "North Zone"
        }
    ]

    for cdata in seed_complaints:
        complaint = Complaint(
            tracking_code=cdata["tracking_code"],
            citizen_id=user_citizen.id,
            department_id=cdata["dept"].id,
            officer_id=officer_profile.id if cdata["status"] != ComplaintStatusEnum.SUBMITTED else None,
            field_worker_name="Worker Team Alpha" if cdata["status"] in [ComplaintStatusEnum.WORKER_ASSIGNED, ComplaintStatusEnum.IN_PROGRESS, ComplaintStatusEnum.WORK_COMPLETED, ComplaintStatusEnum.CITIZEN_VERIFIED] else None,
            title=cdata["title"],
            description=cdata["desc"],
            category=cdata["category"],
            priority=cdata["priority"],
            status=cdata["status"],
            latitude=cdata["lat"],
            longitude=cdata["lng"],
            address=cdata["address"],
            zone_name=cdata["zone"],
            qr_code_url=f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={cdata['tracking_code']}"
        )
        db.add(complaint)
        db.flush()

        # Image
        cimg = ComplaintImage(
            complaint_id=complaint.id,
            image_url=cdata["image"],
            image_type=ImageTypeEnum.CITIZEN
        )
        db.add(cimg)

        # AI prediction
        ai = AIPrediction(
            complaint_id=complaint.id,
            is_genuine_civic_issue=True,
            authenticity_score=0.97,
            predicted_category=cdata["category"],
            confidence_percentage=95.4,
            alternative_predictions=[{"category": "Road Damage", "confidence": 0.85}],
            predicted_priority=cdata["priority"],
            recommended_department=cdata["dept"].name,
            severity_notes=f"AI verified {cdata['category']} problem. Severity: {cdata['priority'].value}.",
            flagged_for_manual_review=False
        )
        db.add(ai)

        # History log
        hist = ComplaintHistory(
            complaint_id=complaint.id,
            status=cdata["status"],
            notes=f"Complaint registered and status updated to {cdata['status'].value}",
            updated_by_name="System / AI Classifier"
        )
        db.add(hist)

        if cdata["status"] == ComplaintStatusEnum.CITIZEN_VERIFIED:
            fb = Feedback(
                complaint_id=complaint.id,
                user_id=user_citizen.id,
                rating=5,
                comments="Super fast resolution by Highways team! Thank you CivicEye."
            )
            db.add(fb)

    db.commit()
    db.close()
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
