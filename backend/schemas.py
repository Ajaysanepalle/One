from pydantic import BaseModel
from typing import Optional
import datetime

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminCreate(BaseModel):
    username: str
    email: str
    password: str

class AdminResponse(BaseModel):
    id: int
    username: str
    email: str
    
    class Config:
        from_attributes = True

class JobCreate(BaseModel):
    job_name: str
    company: str
    job_description: str
    eligible_years: str
    qualification: str
    link: str
    location: str
    last_date: str

class JobUpdate(BaseModel):
    job_name: Optional[str] = None
    company: Optional[str] = None
    job_description: Optional[str] = None
    eligible_years: Optional[str] = None
    qualification: Optional[str] = None
    link: Optional[str] = None
    location: Optional[str] = None
    last_date: Optional[str] = None

class JobResponse(BaseModel):
    id: int
    job_name: str
    company: str
    job_description: str
    eligible_years: str
    qualification: str
    link: str
    location: str
    last_date: str
    created_at: datetime.datetime
    updated_at: datetime.datetime
    
    class Config:
        from_attributes = True

class UserVisitResponse(BaseModel):
    total_visits: int
    unique_visitors: int
