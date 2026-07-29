from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.models import User, UserRole, Officer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id = payload.get("sub")
    if user_id is None:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user

def get_current_officer(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Officer:
    if current_user.role not in [UserRole.OFFICER, UserRole.ADMIN]:
        raise HTTPException(status_code=403, detail="Officer privileges required")
    
    officer = db.query(Officer).filter(Officer.user_id == current_user.id).first()
    if not officer and current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=404, detail="Officer profile not found")
    return officer

def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin privileges required")
    return current_user
