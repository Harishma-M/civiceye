from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import DashboardAnalyticsResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard", response_model=DashboardAnalyticsResponse)
def get_dashboard_analytics(db: Session = Depends(get_db)):
    return AnalyticsService.get_dashboard_analytics(db)

@router.get("/export-csv")
def export_complaints_csv(db: Session = Depends(get_db)):
    data = AnalyticsService.get_dashboard_analytics(db)
    csv_header = "TrackingCode,Category,Priority,Status,Zone,Latitude,Longitude\n"
    csv_rows = []
    for point in data["heatmap_data"]:
        csv_rows.append(f"{point['id']},{point['category']},{point['priority']},{point['status']},Central Zone,{point['lat']},{point['lng']}")
    
    csv_content = csv_header + "\n".join(csv_rows)
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=civiceye_complaints_audit.csv"}
    )
