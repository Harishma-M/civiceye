from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Department, User, AIPrediction, Complaint
from app.schemas.schemas import DepartmentResponse, DepartmentBase
from app.api.deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/departments", response_model=List[DepartmentResponse])
def get_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()

@router.post("/departments", response_model=DepartmentResponse)
def create_department(
    dept_in: DepartmentBase,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    existing = db.query(Department).filter(Department.code == dept_in.code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Department code already exists")
    
    dept = Department(
        name=dept_in.name,
        code=dept_in.code,
        description=dept_in.description,
        contact_email=dept_in.contact_email,
        contact_phone=dept_in.contact_phone,
        head_officer_name=dept_in.head_officer_name
    )
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return dept

@router.get("/system-status")
def get_system_status(db: Session = Depends(get_db), current_admin: User = Depends(get_current_admin)):
    total_users = db.query(User).count()
    total_predictions = db.query(AIPrediction).count()
    flagged_reviews = db.query(AIPrediction).filter(AIPrediction.flagged_for_manual_review == True).count()
    
    return {
        "status": "HEALTHY",
        "version": "1.0.0",
        "ai_engine_status": "ONLINE",
        "ai_model": "YOLOv8 + ResNet50 Civic Classifier",
        "total_users": total_users,
        "total_ai_inferences": total_predictions,
        "flagged_for_manual_review": flagged_reviews,
        "duplicate_detection_radius": "30 Meters (Haversine)",
        "database": "Active (SQLite/PostgreSQL)"
    }
