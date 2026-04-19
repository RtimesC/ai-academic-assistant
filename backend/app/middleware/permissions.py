from fastapi import HTTPException, status, Request
from typing import List, Callable
from functools import wraps
from app.routes.auth import verify_token

def require_role(allowed_roles: List[str]):
    """
    权限检查装饰器
    确保只有指定角色的用户才能访问该路由

    使用方法:
    @router.get("/admin-only")
    @require_role(["admin"])
    def admin_only_endpoint(current_user = Depends(get_current_user)):
        return {"message": "Admin only"}
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            token = kwargs.get("token") or (kwargs.get("request") and kwargs["request"].headers.get("Authorization", "").replace("Bearer ", ""))

            if not token:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Not authenticated"
                )

            try:
                payload = verify_token(token)
                user_role = payload.get("role")

                if user_role not in allowed_roles:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=f"Role '{user_role}' is not allowed. Required roles: {allowed_roles}"
                    )

                kwargs["current_role"] = user_role
            except HTTPException:
                raise

            return await func(*args, **kwargs)

        return wrapper
    return decorator

class RoleChecker:
    """角色检查类，用于 FastAPI Depends"""
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, token: str):
        payload = verify_token(token)
        user_role = payload.get("role")

        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient permissions. Required roles: {self.allowed_roles}"
            )

        return user_role
