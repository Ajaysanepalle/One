from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from database import Base
import datetime

class Admin(Base):
    __tablename__ = "admins"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    job_name = Column(String, index=True)
    company = Column(String, index=True)
    job_description = Column(Text)
    eligible_years = Column(String)  # e.g., "0-2, 2-5, 5+"
    qualification = Column(String)
    link = Column(String)
    location = Column(String)
    last_date = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    admin_id = Column(Integer)
    is_active = Column(Boolean, default=True)

class UserVisit(Base):
    __tablename__ = "user_visits"
    
    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String)
    user_agent = Column(String)
    visited_at = Column(DateTime, default=datetime.datetime.utcnow)
    job_id = Column(Integer, nullable=True)
