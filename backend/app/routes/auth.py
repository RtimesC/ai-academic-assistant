from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
import hashlib
from pydantic import BaseModel

from app.database import get_db
from app.models.user import User, UserRole

# JWT 配置
SECRET_KEY = "your-secret-key-change-in-production"  # 生产环境需要改为强密钥
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8小时

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Pydantic 模型
class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    organization_id: Optional[int]

class LoginResponse(BaseModel):
    token: str
    user: UserResponse

# 工具函数
def hash_password(password: str) -> str:
    """对密码进行 hash"""
    return hashlib.sha256(password.encode()).hexdigest()

def create_access_token(user_id: int, role: str, expires_delta: Optional[timedelta] = None) -> str:
    """生成 JWT token"""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "user_id": user_id,
        "role": role,
        "exp": expire
    }
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str) -> dict:
    """验证和解码 JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

async def get_current_user(token: str = None, db: Session = Depends(get_db)) -> User:
    """获取当前认证用户"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    payload = verify_token(token)
    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user

# 路由

@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    用户登录

    测试账户:
    - username: doctor, password: 123456
    - username: admin, password: 123456
    - username: patient, password: 123456
    """
    # 查找用户
    user = db.query(User).filter(User.username == request.username).first()

    if not user or hash_password(request.password) != user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is disabled"
        )

    # 更新最后登录时间
    user.last_login = datetime.utcnow()
    db.commit()

    # 生成 token
    token = create_access_token(user.id, user.role)

    return LoginResponse(
        token=token,
        user=UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            role=user.role.value,
            organization_id=user.organization_id
        )
    )

@router.post("/verify-token")
def verify_token_endpoint(token: str):
    """验证 token 是否有效"""
    try:
        payload = verify_token(token)
        return {"valid": True, "user_id": payload.get("user_id")}
    except HTTPException:
        return {"valid": False}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(token: str = None, db: Session = Depends(get_db)):
    """获取当前用户信息"""
    user = await get_current_user(token, db)
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        role=user.role.value,
        organization_id=user.organization_id
    )

# 测试数据初始化函数（用于演示）
def init_test_users(db: Session):
    """
    初始化测试用户
    这个函数应该在应用启动时调用
    """
    test_users = [
        User(
            username="admin",
            email="admin@hospital.com",
            password_hash=hash_password("123456"),
            role=UserRole.ADMIN,
            organization_id=1,
            is_active=True
        ),
        User(
            username="doctor",
            email="doctor@hospital.com",
            password_hash=hash_password("123456"),
            role=UserRole.DOCTOR,
            organization_id=1,
            is_active=True
        ),
        User(
            username="patient",
            email="patient@hospital.com",
            password_hash=hash_password("123456"),
            role=UserRole.PATIENT,
            organization_id=1,
            is_active=True
        ),
    ]

    for user in test_users:
        existing = db.query(User).filter(User.username == user.username).first()
        if not existing:
            db.add(user)

    db.commit()
