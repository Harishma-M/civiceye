from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Officer, User, UserRole, Department
from app.schemas.schemas import OfficerResponse, OfficerCreate
from app.api.deps import get_current_user, get_current_admin

router = APIRouter(prefix="/officers", tags=["Officers"])

@router.get("/", response_model=List[OfficerResponse])
def list_officers(db: Session = Depends(get_db)):
    return db.query(Officer).all()

@router.post("/", response_model=OfficerResponse)
def create_officer(
    off_in: OfficerCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    user = db.query(User).filter(User.id == off_in.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update role to OFFICER
    user.role = UserRole.OFFICER

    officer = Officer(
        user_id=off_in.user_id,
        department_id=off_in.department_id,
        employee_id=off_in.employee_id,
        badge_number=off_in.badge_number,
        designation=off_in.designation
    )
    db.add(officer)
    db.commit()
    db.refresh(officer)
    return officer
