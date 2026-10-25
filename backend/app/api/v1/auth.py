# ============================================
# SKILLSYNC AI — AUTH API ROUTES
# ============================================
from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime
from app.schemas.all_schemas import UserCreate, UserLogin, UserResponse, Token
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

# In-memory mock storage for rapid local runs
USERS_DB = {
    "demo@skillsync.ai": {
        "id": "demo-user-1",
        "email": "demo@skillsync.ai",
        "full_name": "Demo User",
        "target_role": "Full-Stack Developer",
        "experience_level": "junior",
        "created_at": datetime.utcnow().isoformat(),
    }
}


@router.post("/register", response_model=Token)
async def register(user_in: UserCreate):
    if user_in.email in USERS_DB:
        raise HTTPException(status_code=400, detail="A user with this email already exists")

    user_data = {
        "id": f"user-{len(USERS_DB) + 1}",
        "email": user_in.email,
        "full_name": user_in.full_name,
        "target_role": user_in.target_role or "Full-Stack Developer",
        "experience_level": user_in.experience_level or "junior",
        "created_at": datetime.utcnow().isoformat(),
    }
    USERS_DB[user_in.email] = user_data
    token = create_access_token(subject=user_data["id"])
    return Token(access_token=token, user=UserResponse(**user_data))


@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    user_data = USERS_DB.get(credentials.email)
    if not user_data:
        # Default mock user on local demo
        user_data = {
            "id": "demo-user-1",
            "email": credentials.email,
            "full_name": credentials.email.split("@")[0].capitalize(),
            "target_role": "Full-Stack Developer",
            "experience_level": "junior",
            "created_at": datetime.utcnow().isoformat(),
        }
        USERS_DB[credentials.email] = user_data

    token = create_access_token(subject=user_data["id"])
    return Token(access_token=token, user=UserResponse(**user_data))


@router.get("/me", response_model=UserResponse)
async def get_current_user():
    user_data = USERS_DB.get("demo@skillsync.ai")
    return UserResponse(**user_data)


@router.patch("/profile", response_model=UserResponse)
async def update_profile(updates: dict):
    user_data = USERS_DB.get("demo@skillsync.ai")
    if user_data:
        user_data.update(updates)
        return UserResponse(**user_data)
    raise HTTPException(status_code=404, detail="User not found")
