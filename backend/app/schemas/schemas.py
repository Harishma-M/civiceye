from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr
from app.models.models import UserRole, ComplaintPriority, ComplaintStatusEnum, ImageTypeEnum

# Auth & User Schemas
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: Optional[UserRole] = UserRole.CITIZEN

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    role: str
    full_name: str
    email: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    phone: Optional[str]
    role: UserRole
    profile_image: Optional[str]
    reward_points: int
    badge: str
    language: str

    class Config:
        from_attributes = True

# Department Schemas
class DepartmentBase(BaseModel):
    name: str
    code: str
    description: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    head_officer_name: Optional[str] = None

class DepartmentResponse(DepartmentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Officer Schemas
class OfficerCreate(BaseModel):
    user_id: int
    department_id: int
    employee_id: str
    badge_number: Optional[str] = None
    designation: Optional[str] = None

class OfficerResponse(BaseModel):
    id: int
    user_id: int
    department_id: int
    employee_id: str
    badge_number: Optional[str]
    designation: Optional[str]
    is_available: bool
    user: UserResponse
    department: DepartmentResponse

    class Config:
        from_attributes = True

# AI Prediction Schemas
class AlternativePrediction(BaseModel):
    category: str
    confidence: float

class AIPredictionResponse(BaseModel):
    is_genuine_civic_issue: bool
    authenticity_score: float
    predicted_category: str
    confidence_percentage: float
    alternative_predictions: List[AlternativePrediction]
    predicted_priority: ComplaintPriority
    recommended_department: str
    severity_notes: str
    flagged_for_manual_review: bool

class DuplicateCheckRequest(BaseModel):
    latitude: float
    longitude: float
    category: str

class DuplicateCheckResponse(BaseModel):
    is_duplicate: bool
    existing_complaint_id: Optional[int] = None
    existing_tracking_code: Optional[str] = None
    distance_meters: Optional[float] = None
    message: str

# Complaint Schemas
class ComplaintImageSchema(BaseModel):
    id: int
    image_url: str
    image_type: ImageTypeEnum
    uploaded_at: datetime

    class Config:
        from_attributes = True

class ComplaintHistorySchema(BaseModel):
    id: int
    status: ComplaintStatusEnum
    notes: Optional[str]
    updated_by_name: str
    timestamp: datetime

    class Config:
        from_attributes = True

class ComplaintCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    latitude: float
    longitude: float
    address: Optional[str] = None
    zone_name: Optional[str] = "Zone 1"
    image_url: str
    voice_note_url: Optional[str] = None
    is_offline_synced: Optional[bool] = False

class ComplaintResponse(BaseModel):
    id: int
    tracking_code: str
    citizen_id: int
    department_id: Optional[int]
    officer_id: Optional[int]
    field_worker_name: Optional[str]
    title: str
    description: Optional[str]
    category: str
    priority: ComplaintPriority
    status: ComplaintStatusEnum
    latitude: float
    longitude: float
    address: Optional[str]
    zone_name: Optional[str]
    is_duplicate: bool
    qr_code_url: Optional[str]
    estimated_resolution_hours: int
    created_at: datetime
    updated_at: datetime
    images: List[ComplaintImageSchema] = []
    history: List[ComplaintHistorySchema] = []
    ai_prediction: Optional[AIPredictionResponse] = None
    department: Optional[DepartmentResponse] = None
    assigned_officer: Optional[OfficerResponse] = None
    citizen: Optional[UserResponse] = None

    class Config:
        from_attributes = True

class StatusUpdateRequest(BaseModel):
    status: ComplaintStatusEnum
    notes: Optional[str] = None
    work_image_url: Optional[str] = None
    field_worker_name: Optional[str] = None
    assigned_officer_id: Optional[int] = None

# Analytics & Dashboard Schemas
class DashboardAnalyticsResponse(BaseModel):
    total_complaints: int
    todays_complaints: int
    resolved_complaints: int
    pending_complaints: int
    critical_complaints: int
    in_progress_complaints: int
    avg_resolution_hours: float
    citizen_satisfaction_rate: float
    category_distribution: dict
    priority_distribution: dict
    department_performance: List[dict]
    monthly_trends: List[dict]
    most_affected_locations: List[dict]
    heatmap_data: List[dict]

# Feedback Schema
class FeedbackCreate(BaseModel):
    complaint_id: int
    rating: int
    comments: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    complaint_id: int
    user_id: int
    rating: int
    comments: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# Chatbot Schema
class ChatRequest(BaseModel):
    message: str
    complaint_tracking_code: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str] = []
    timestamp: datetime
