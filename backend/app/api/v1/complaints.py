import random
import string
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import (
    Complaint, ComplaintImage, ComplaintHistory, AIPrediction, 
    Department, Officer, User, Feedback, ComplaintStatusEnum, ImageTypeEnum, UserRole
)
from app.schemas.schemas import (
    ComplaintCreate, ComplaintResponse, StatusUpdateRequest,
    AIPredictionResponse, DuplicateCheckRequest, DuplicateCheckResponse,
    FeedbackCreate, FeedbackResponse
)
from app.services.ai_engine import AIEngine, DEPARTMENT_ROUTING
from app.api.deps import get_current_user

router = APIRouter(prefix="/complaints", tags=["Complaints"])

def generate_tracking_code() -> str:
    suffix = ''.join(random.choices(string.digits, k=4))
    return f"CIV-2026-{suffix}"

@router.post("/check-ai", response_model=AIPredictionResponse)
def check_ai_prediction(image_url: str, description: Optional[str] = ""):
    """
    Runs AI verification and 12-class image prediction before complaint submission.
    """
    prediction = AIEngine.verify_and_classify_image(image_url, description)
    return prediction

@router.post("/check-duplicate", response_model=DuplicateCheckResponse)
def check_duplicate_complaint(req: DuplicateCheckRequest, db: Session = Depends(get_db)):
    """
    Haversine Geolocation Math: Checks if another active complaint exists within 30 meters.
    """
    active_statuses = [
        ComplaintStatusEnum.SUBMITTED,
        ComplaintStatusEnum.OFFICER_NOTIFIED,
        ComplaintStatusEnum.ACCEPTED,
        ComplaintStatusEnum.WORKER_ASSIGNED,
        ComplaintStatusEnum.IN_PROGRESS
    ]
    
    complaints = db.query(Complaint).filter(
        Complaint.status.in_(active_statuses),
        Complaint.category == req.category
    ).all()

    for c in complaints:
        dist = AIEngine.calculate_haversine_distance(req.latitude, req.longitude, c.latitude, c.longitude)
        if dist <= 30.0:
            return {
                "is_duplicate": True,
                "existing_complaint_id": c.id,
                "existing_tracking_code": c.tracking_code,
                "distance_meters": round(dist, 1),
                "message": f"⚠️ Existing active complaint {c.tracking_code} found within {round(dist, 1)}m! You can upvote or track that issue instead."
            }

    return {
        "is_duplicate": False,
        "existing_complaint_id": None,
        "existing_tracking_code": None,
        "distance_meters": None,
        "message": "✅ Location is clear. No duplicate complaints found within 30m radius."
    }

@router.post("/", response_model=ComplaintResponse)
def create_complaint(
    complaint_in: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Run AI Pipeline
    ai_result = AIEngine.verify_and_classify_image(complaint_in.image_url, complaint_in.description or "")
    
    # Department lookup
    dept_name = ai_result["recommended_department"]
    dept = db.query(Department).filter(Department.name == dept_name).first()
    if not dept:
        dept = db.query(Department).first()

    # Create Complaint record
    code = generate_tracking_code()
    complaint = Complaint(
        tracking_code=code,
        citizen_id=current_user.id,
        department_id=dept.id if dept else None,
        title=complaint_in.title or f"{ai_result['predicted_category']} issue reported",
        description=complaint_in.description,
        category=ai_result["predicted_category"],
        priority=ai_result["predicted_priority"],
        status=ComplaintStatusEnum.SUBMITTED,
        latitude=complaint_in.latitude,
        longitude=complaint_in.longitude,
        address=complaint_in.address or "Detected GPS Location",
        zone_name=complaint_in.zone_name or "Zone 1",
        voice_note_url=complaint_in.voice_note_url,
        is_offline_synced=complaint_in.is_offline_synced or False,
        qr_code_url=f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={code}"
    )
    db.add(complaint)
    db.flush()

    # Image
    img = ComplaintImage(
        complaint_id=complaint.id,
        image_url=complaint_in.image_url,
        image_type=ImageTypeEnum.CITIZEN
    )
    db.add(img)

    # AI Prediction record
    ai_pred = AIPrediction(
        complaint_id=complaint.id,
        is_genuine_civic_issue=ai_result["is_genuine_civic_issue"],
        authenticity_score=ai_result["authenticity_score"],
        predicted_category=ai_result["predicted_category"],
        confidence_percentage=ai_result["confidence_percentage"],
        alternative_predictions=ai_result["alternative_predictions"],
        predicted_priority=ai_result["predicted_priority"],
        recommended_department=dept_name,
        severity_notes=ai_result["severity_notes"],
        flagged_for_manual_review=ai_result["flagged_for_manual_review"]
    )
    db.add(ai_pred)

    # Initial history log
    history = ComplaintHistory(
        complaint_id=complaint.id,
        status=ComplaintStatusEnum.SUBMITTED,
        notes="Complaint filed by citizen & AI classification completed",
        updated_by_name=current_user.full_name
    )
    db.add(history)

    # Reward user points
    current_user.reward_points += 15

    db.commit()
    db.refresh(complaint)
    return complaint

@router.get("/", response_model=List[ComplaintResponse])
def get_complaints(
    status: Optional[ComplaintStatusEnum] = None,
    category: Optional[str] = None,
    priority: Optional[str] = None,
    department_id: Optional[int] = None,
    citizen_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Complaint)
    if status:
        query = query.filter(Complaint.status == status)
    if category:
        query = query.filter(Complaint.category == category)
    if priority:
        query = query.filter(Complaint.priority == priority)
    if department_id:
        query = query.filter(Complaint.department_id == department_id)
    if citizen_id:
        query = query.filter(Complaint.citizen_id == citizen_id)

    return query.order_by(Complaint.created_at.desc()).all()

@router.get("/{tracking_code}", response_model=ComplaintResponse)
def get_complaint_by_tracking_code(tracking_code: str, db: Session = Depends(get_db)):
    complaint = db.query(Complaint).filter(Complaint.tracking_code == tracking_code).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@router.put("/{complaint_id}/status", response_model=ComplaintResponse)
def update_complaint_status(
    complaint_id: int,
    req: StatusUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = req.status
    if req.field_worker_name:
        complaint.field_worker_name = req.field_worker_name
    if req.assigned_officer_id:
        complaint.officer_id = req.assigned_officer_id

    # If work image provided (Before/After)
    if req.work_image_url:
        img_type = ImageTypeEnum.AFTER if req.status in [ComplaintStatusEnum.WORK_COMPLETED, ComplaintStatusEnum.CITIZEN_VERIFIED] else ImageTypeEnum.BEFORE
        work_img = ComplaintImage(
            complaint_id=complaint.id,
            image_url=req.work_image_url,
            image_type=img_type
        )
        db.add(work_img)

    # History log
    history = ComplaintHistory(
        complaint_id=complaint.id,
        status=req.status,
        notes=req.notes or f"Status updated to {req.status.value}",
        updated_by_name=current_user.full_name
    )
    db.add(history)

    db.commit()
    db.refresh(complaint)
    return complaint

@router.post("/{complaint_id}/feedback", response_model=FeedbackResponse)
def submit_feedback(
    complaint_id: int,
    fb_in: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    fb = Feedback(
        complaint_id=complaint_id,
        user_id=current_user.id,
        rating=fb_in.rating,
        comments=fb_in.comments
    )
    db.add(fb)
    
    # Auto mark verified
    complaint.status = ComplaintStatusEnum.CITIZEN_VERIFIED
    
    db.commit()
    db.refresh(fb)
    return fb
