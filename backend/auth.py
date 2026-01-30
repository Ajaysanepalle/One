import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional

# Simple token management (for production, use JWT)
ADMIN_TOKENS = {}
ADMIN_CREDENTIALS = {
    "admin": "hashed_password_here"  # Will be updated with actual hash
}

def hash_password(password: str) -> str:
    """Hash password using SHA256 with salt"""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
    return f"{salt}${pwd_hash.hex()}"

def verify_password(password: str, hash_value: str) -> bool:
    """Verify password against hash"""
    try:
        salt, pwd_hash = hash_value.split('$')
        pwd_hash_check = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000)
        return pwd_hash_check.hex() == pwd_hash
    except:
        return False

def create_access_token(admin_id: int, expires_delta: Optional[timedelta] = None) -> str:
    """Create simple access token"""
    if expires_delta is None:
        expires_delta = timedelta(hours=24)
    
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + expires_delta
    ADMIN_TOKENS[token] = {"admin_id": admin_id, "expires_at": expires_at}
    
    return token

def verify_token(token: str) -> Optional[int]:
    """Verify token and return admin_id"""
    if token in ADMIN_TOKENS:
        token_data = ADMIN_TOKENS[token]
        if token_data["expires_at"] > datetime.utcnow():
            return token_data["admin_id"]
        else:
            del ADMIN_TOKENS[token]
    return None

def logout_token(token: str):
    """Logout by removing token"""
    if token in ADMIN_TOKENS:
        del ADMIN_TOKENS[token]
