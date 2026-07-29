import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Enum, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class UserRole(str, enum.Enum):
    CITIZEN = "CITIZEN"
    OFFICER = "OFFICER"
    ADMIN = "ADMIN"

class ComplaintPriority(str, enum.Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class ComplaintStatusEnum(str, enum.Enum):
    SUBMITTED = "SUBMITTED"
    OFFICER_NOTIFIED = "OFFICER_NOTIFIED"
    ACCEPTED = "ACCEPTED"
    WORKER_ASSIGNED = "WORKER_ASSIGNED"
    IN_PROGRESS = "IN_PROGRESS"
    WORK_COMPLETED = "WORK_COMPLETED"
    CITIZEN_VERIFIED = "CITIZEN_VERIFIED"
    REJECTED = "REJECTED"
    CLOSED = "CLOSED"

class ImageTypeEnum(str, enum.Enum):
    CITIZEN = "CITIZEN"
    BEFORE = "BEFORE"
    AFTER = "AFTER"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.CITIZEN, nullable=False)
    profile_image = Column(String, nullable=True)
    language = Column(String, default="English")
    reward_points = Column(Integer, default=50)
    badge = Column(String, default="Civic Sentinel")
    created_at = Column(DateTime, default=datetime.utcnow)

    complaints = relationship("Complaint", back_populates="citizen", foreign_keys="Complaint.citizen_id")
    officer_profile = relationship("Officer", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user")
    feedbacks = relationship("Feedback", back_populates="user")

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    code = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    head_officer_name = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    officers = relationship("Officer", back_populates="department")
    complaints = relationship("Complaint", back_populates="department")

class Officer(Base):
    __tablename__ = "officers"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    employee_id = Column(String, unique=True, nullable=False)
    badge_number = Column(String, nullable=True)
    designation = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)

    user = relationship("User", back_populates="officer_profile")
    department = relationship("Department", back_populates="officers")
    assigned_complaints = relationship("Complaint", back_populates="assigned_officer", foreign_keys="Complaint.officer_id")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    tracking_code = Column(String, unique=True, index=True, nullable=False)
    citizen_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    officer_id = Column(Integer, ForeignKey("officers.id"), nullable=True)
    field_worker_name = Column(String, nullable=True)
    
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False)  # Road Damage, Pothole, Garbage, etc.
    priority = Column(Enum(ComplaintPriority), default=ComplaintPriority.MEDIUM)
    status = Column(Enum(ComplaintStatusEnum), default=ComplaintStatusEnum.SUBMITTED)
    
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String, nullable=True)
    zone_name = Column(String, nullable=True)

    is_duplicate = Column(Boolean, default=False)
    duplicate_of_id = Column(Integer, ForeignKey("complaints.id"), nullable=True)

    is_offline_synced = Column(Boolean, default=False)
    voice_note_url = Column(String, nullable=True)
    qr_code_url = Column(String, nullable=True)
    
    estimated_resolution_hours = Column(Integer, default=24)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    citizen = relationship("User", back_populates="complaints", foreign_keys=[citizen_id])
    department = relationship("Department", back_populates="complaints")
    assigned_officer = relationship("Officer", back_populates="assigned_complaints", foreign_keys=[officer_id])
    images = relationship("ComplaintImage", back_populates="complaint", cascade="all, delete-orphan")
    history = relationship("ComplaintHistory", back_populates="complaint", cascade="all, delete-orphan")
    ai_prediction = relationship("AIPrediction", back_populates="complaint", uselist=False, cascade="all, delete-orphan")
    feedback = relationship("Feedback", back_populates="complaint", uselist=False)

class ComplaintImage(Base):
    __tablename__ = "complaint_images"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    image_url = Column(String, nullable=False)
    image_type = Column(Enum(ImageTypeEnum), default=ImageTypeEnum.CITIZEN)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("Complaint", back_populates="images")

class ComplaintHistory(Base):
    __tablename__ = "complaint_history"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    status = Column(Enum(ComplaintStatusEnum), nullable=False)
    notes = Column(Text, nullable=True)
    updated_by_name = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("Complaint", back_populates="history")

class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    is_genuine_civic_issue = Column(Boolean, default=True)
    authenticity_score = Column(Float, default=0.95)
    predicted_category = Column(String, nullable=False)
    confidence_percentage = Column(Float, nullable=False)
    alternative_predictions = Column(JSON, nullable=True)
    predicted_priority = Column(Enum(ComplaintPriority), nullable=False)
    recommended_department = Column(String, nullable=False)
    severity_notes = Column(Text, nullable=True)
    flagged_for_manual_review = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("Complaint", back_populates="ai_prediction")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(String, nullable=False)
    type = Column(String, default="INFO")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="notifications")

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1 to 5 stars
    comments = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    complaint = relationship("Complaint", back_populates="feedback")
    user = relationship("User", back_populates="feedbacks")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    sender = Column(String, nullable=False) # "USER" or "AI_BOT"
    message = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

class Location(Base):
    __tablename__ = "locations"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    address = Column(String, nullable=True)
    zone_name = Column(String, nullable=True)
    city = Column(String, default="Metropolis City")
