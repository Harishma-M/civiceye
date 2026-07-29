from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import ChatRequest, ChatResponse
from app.services.chatbot_service import AIChatbotService
from app.api.deps import get_current_user
from app.models.models import User, ChatMessage
from datetime import datetime

router = APIRouter(prefix="/chatbot", tags=["AI Chatbot"])

@router.post("/query", response_model=ChatResponse)
def query_chatbot(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Save user message
    user_msg = ChatMessage(
        user_id=current_user.id,
        sender="USER",
        message=req.message
    )
    db.add(user_msg)

    res = AIChatbotService.process_chat_message(
        db=db,
        message=req.message,
        user_id=current_user.id,
        tracking_code=req.complaint_tracking_code
    )

    # Save bot reply
    bot_msg = ChatMessage(
        user_id=current_user.id,
        sender="AI_BOT",
        message=res["reply"]
    )
    db.add(bot_msg)
    db.commit()

    return {
        "reply": res["reply"],
        "suggested_actions": res["suggested_actions"],
        "timestamp": datetime.utcnow()
    }
