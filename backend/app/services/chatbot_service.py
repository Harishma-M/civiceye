import re
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.models import Complaint

class AIChatbotService:
    """
    Intelligent Assistant for CivicEye citizens and officers.
    """

    @staticmethod
    def process_chat_message(db: Session, message: str, user_id: int, tracking_code: str = None) -> Dict[str, Any]:
        text = message.lower().strip()
        
        # Check if user mentioned a tracking code in text e.g. "CIV-2026-1001"
        code_match = re.search(r'civ-\d{4}-\d{4}', text, re.IGNORECASE)
        target_code = tracking_code or (code_match.group(0).upper() if code_match else None)

        if target_code:
            complaint = db.query(Complaint).filter(Complaint.tracking_code == target_code).first()
            if complaint:
                status_formatted = complaint.status.value.replace("_", " ").title()
                dept_name = complaint.department.name if complaint.department else "Assigned Department"
                reply = (
                    f"📌 **Status of {complaint.tracking_code}**:\n\n"
                    f"• **Title**: {complaint.title}\n"
                    f"• **Category**: {complaint.category}\n"
                    f"• **Current Status**: `{status_formatted}`\n"
                    f"• **Department**: {dept_name}\n"
                    f"• **Priority**: {complaint.priority.value}\n"
                    f"• **Est. Resolution Time**: {complaint.estimated_resolution_hours} Hours"
                )
                return {
                    "reply": reply,
                    "suggested_actions": ["View Full Progress Timeline", "Contact Assigned Officer", "Rate Resolution"]
                }
            else:
                return {
                    "reply": f"⚠️ I couldn't find any complaint with tracking code `{target_code}`. Please verify the code and try again.",
                    "suggested_actions": ["View My Complaint History", "Report New Issue"]
                }

        if "status" in text or "where is my" in text or "track" in text:
            recent_complaint = db.query(Complaint).filter(Complaint.citizen_id == user_id).order_by(Complaint.created_at.desc()).first()
            if recent_complaint:
                status_formatted = recent_complaint.status.value.replace("_", " ").title()
                reply = (
                    f"Your most recent complaint is **{recent_complaint.tracking_code}** ({recent_complaint.title}).\n\n"
                    f"• **Status**: `{status_formatted}`\n"
                    f"• **Priority**: {recent_complaint.priority.value}\n"
                    f"• **Reported Date**: {recent_complaint.created_at.strftime('%Y-%m-%d %H:%M')}"
                )
                return {
                    "reply": reply,
                    "suggested_actions": [f"Track {recent_complaint.tracking_code}", "Report New Complaint"]
                }
            else:
                return {
                    "reply": "You haven't submitted any complaints yet. Would you like to report a civic issue now?",
                    "suggested_actions": ["Report Pothole", "Report Garbage Dump", "Report Water Leakage"]
                }

        elif "how long" in text or "eta" in text or "time" in text:
            reply = (
                "⏱️ **Standard Resolution SLAs**:\n"
                "• 🚨 **Critical** (Traffic Signal, Sewage Overflow): 6 - 12 Hours\n"
                "• ⚡ **High** (Water Leak, Road Damage): 12 - 24 Hours\n"
                "• 📦 **Medium** (Garbage, Illegal Dumping): 24 - 48 Hours\n"
                "• 💡 **Low** (Street Lights): 48 - 72 Hours"
            )
            return {
                "reply": reply,
                "suggested_actions": ["Check My Active Complaints", "Contact Helpdesk"]
            }

        elif "how to report" in text or "guide" in text or "help" in text:
            reply = (
                "📷 **How to Report a Civic Issue**:\n"
                "1. Tap **Snap Photo** or upload from gallery.\n"
                "2. CivicEye AI will automatically verify the photo, detect the category & priority.\n"
                "3. Your GPS location is auto-detected.\n"
                "4. Tap **Submit Complaint** to notify the nearby municipal office instantly!"
            )
            return {
                "reply": reply,
                "suggested_actions": ["Open Camera", "Try Voice Complaint"]
            }

        elif "office" in text or "nearby" in text or "municipal" in text:
            reply = (
                "🏛️ **Nearest Municipal Administration Hubs**:\n"
                "• **Central Municipal Corporation HQ**: 124 Civic Avenue (Ph: 1800-425-0011)\n"
                "• **Zone 1 Public Works Office**: West Coast Road (Ph: 044-2834-9900)\n"
                "• **Water Supply & Sewage Board**: Riverfront Block B (Ph: 1916)"
            )
            return {
                "reply": reply,
                "suggested_actions": ["View Office on Map", "Emergency Call"]
            }

        elif "emergency" in text or "contact" in text or "helpline" in text:
            reply = (
                "🚨 **24/7 Civic Emergency Helplines**:\n"
                "• Municipal Control Room: **1800-425-0011**\n"
                "• Sewage & Water Emergency: **1916**\n"
                "• Electrical Grid Helpline: **1912**\n"
                "• Disaster Management: **1077**"
            )
            return {
                "reply": reply,
                "suggested_actions": ["Call Control Room", "Report Critical Hazard"]
            }

        else:
            reply = (
                "Hello! I am your **CivicEye AI Assistant** 🤖.\n\n"
                "I can help you with:\n"
                "• Tracking complaint status & ETAs\n"
                "• Step-by-step reporting guide\n"
                "• Locating municipal offices & emergency numbers\n\n"
                "How can I assist you today?"
            )
            return {
                "reply": reply,
                "suggested_actions": ["Where is my complaint?", "How long will it take?", "Emergency helpline"]
            }
