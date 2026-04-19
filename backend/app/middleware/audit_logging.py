from fastapi import Request
from sqlalchemy.orm import Session
from datetime import datetime
import json
from app.models.audit_log import AuditLog
from app.database import SessionLocal

class AuditLoggingMiddleware:
    """
    审计日志中间件
    记录所有 API 请求的用户操作

    记录信息:
    - 用户 ID
    - 操作类型 (GET, POST, PUT, DELETE)
    - 请求路径
    - IP 地址
    - 时间戳
    """

    def __init__(self, app):
        self.app = app

    async def __call__(self, request: Request, call_next):
        # 获取请求信息
        ip_address = request.client.host if request.client else "unknown"
        method = request.method
        path = request.url.path

        # 从 token 中提取用户 ID
        auth_header = request.headers.get("Authorization", "")
        user_id = None

        if auth_header.startswith("Bearer "):
            token = auth_header.replace("Bearer ", "")
            try:
                from app.routes.auth import verify_token
                payload = verify_token(token)
                user_id = payload.get("user_id")
            except:
                pass

        # 执行请求
        response = await call_next(request)

        # 只记录修改操作 (POST, PUT, DELETE) 和患者相关的获取操作
        should_log = (
            method in ["POST", "PUT", "DELETE"] or
            ("patient" in path and method == "GET")
        )

        if should_log and user_id:
            try:
                db: Session = SessionLocal()

                # 解析资源类型和 ID
                resource_type = "unknown"
                resource_id = None

                if "patient" in path:
                    resource_type = "patient"
                    # 尝试从路径中提取 ID，如 /patients/123
                    parts = path.split("/")
                    for i, part in enumerate(parts):
                        if part == "patients" and i + 1 < len(parts):
                            try:
                                resource_id = int(parts[i + 1])
                            except:
                                pass

                # 创建审计日志记录
                audit_log = AuditLog(
                    user_id=user_id,
                    action=f"{method}_{resource_type}",
                    resource_type=resource_type,
                    resource_id=resource_id,
                    timestamp=datetime.utcnow(),
                    ip_address=ip_address,
                    details=json.dumps({
                        "method": method,
                        "path": path,
                        "status_code": response.status_code
                    })
                )

                db.add(audit_log)
                db.commit()
                db.close()
            except Exception as e:
                print(f"Error logging audit: {e}")

        return response

# 辅助函数：记录特定操作
def log_audit_event(
    db: Session,
    user_id: int,
    action: str,
    resource_type: str,
    resource_id: int,
    ip_address: str = "127.0.0.1",
    details: dict = None
):
    """
    手动记录审计事件

    使用方法:
    log_audit_event(
        db=db,
        user_id=user.id,
        action="view_patient_health_records",
        resource_type="patient",
        resource_id=patient_id,
        ip_address="192.168.1.1",
        details={"viewed_records_count": 5}
    )
    """
    audit_log = AuditLog(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        timestamp=datetime.utcnow(),
        ip_address=ip_address,
        details=json.dumps(details or {})
    )

    db.add(audit_log)
    db.commit()
