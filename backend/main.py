from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
import models
import schemas
from database import engine, get_db
from auth import hash_password, verify_password, create_access_token, verify_token
import os
from functools import lru_cache
from datetime import datetime, timedelta

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Job Portal")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add GZip middleware for compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Store for admin credentials (default admin). Read from environment if provided.
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
DEFAULT_ADMIN = {"username": ADMIN_USERNAME, "password": ADMIN_PASSWORD}
DEFAULT_ADMIN_HASH = hash_password(DEFAULT_ADMIN["password"])

# Helper function to track user visits (async to avoid blocking)
def track_visit(request: Request, db: Session, job_id: int = None):
    try:
        ip = request.client.host if request.client else "unknown"
        user_agent = request.headers.get("user-agent", "unknown")
        visit = models.UserVisit(ip_address=ip, user_agent=user_agent, job_id=job_id)
        db.add(visit)
        db.commit()
    except:
        pass  # Don't block requests on visit tracking errors

# Helper to get current admin
def get_current_admin(token: str = None) -> int:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    admin_id = verify_token(token)
    if not admin_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    return admin_id

# ===================== ADMIN ENDPOINTS =====================

@app.post("/api/admin/login")
def admin_login(credentials: schemas.AdminLogin, request: Request, db: Session = Depends(get_db)):
    """Admin login endpoint"""
    track_visit(request, db)
    
    # For simplicity, check against default admin
    if credentials.username == DEFAULT_ADMIN["username"]:
        if verify_password(credentials.password, DEFAULT_ADMIN_HASH) or credentials.password == DEFAULT_ADMIN["password"]:
            # Create or get admin in DB
            admin = db.query(models.Admin).filter(
                models.Admin.username == credentials.username
            ).first()
            
            if not admin:
                admin = models.Admin(
                    username=credentials.username,
                    email=f"{credentials.username}@manaworks.online",
                    password=DEFAULT_ADMIN_HASH
                )
                db.add(admin)
                db.commit()
                db.refresh(admin)
            
            token = create_access_token(admin.id)
            return {"access_token": token, "token_type": "bearer", "admin_id": admin.id}
    
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/api/admin/logout")
def admin_logout(token: str):
    """Admin logout endpoint"""
    from auth import logout_token
    logout_token(token)
    return {"message": "Logged out successfully"}

@app.get("/api/admin/verify")
def verify_admin(token: str):
    """Verify if admin token is valid"""
    admin_id = verify_token(token)
    if not admin_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    return {"valid": True, "admin_id": admin_id}

# ===================== JOB ENDPOINTS =====================

@app.post("/api/jobs", response_model=schemas.JobResponse)
def create_job(job: schemas.JobCreate, token: str, db: Session = Depends(get_db)):
    """Create a new job posting"""
    admin_id = get_current_admin(token)
    
    db_job = models.Job(
        job_name=job.job_name,
        company=job.company,
        job_description=job.job_description,
        eligible_years=job.eligible_years,
        qualification=job.qualification,
        link=job.link,
        location=job.location,
        last_date=job.last_date,
        admin_id=admin_id
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@app.get("/api/jobs", response_model=list[schemas.JobResponse])
def get_all_jobs(request: Request, db: Session = Depends(get_db)):
    """Get all active job postings"""
    try:
        track_visit(request, db)
    except:
        pass
    
    jobs = db.query(models.Job).filter(
        models.Job.is_active == True
    ).order_by(desc(models.Job.created_at)).all()
    return jobs

@app.get("/api/jobs/{job_id}", response_model=schemas.JobResponse)
def get_job(job_id: int, request: Request, db: Session = Depends(get_db)):
    """Get a specific job posting"""
    try:
        track_visit(request, db, job_id)
    except:
        pass
    
    job = db.query(models.Job).filter(
        models.Job.id == job_id,
        models.Job.is_active == True
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.put("/api/jobs/{job_id}", response_model=schemas.JobResponse)
def update_job(job_id: int, job_update: schemas.JobUpdate, token: str, db: Session = Depends(get_db)):
    """Update a job posting"""
    admin_id = get_current_admin(token)
    
    job = db.query(models.Job).filter(
        models.Job.id == job_id,
        models.Job.admin_id == admin_id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    update_data = job_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(job, field, value)
    
    db.commit()
    db.refresh(job)
    return job

@app.delete("/api/jobs/{job_id}")
def delete_job(job_id: int, token: str, db: Session = Depends(get_db)):
    """Delete a job posting"""
    admin_id = get_current_admin(token)
    
    job = db.query(models.Job).filter(
        models.Job.id == job_id,
        models.Job.admin_id == admin_id
    ).first()
    
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.is_active = False
    db.commit()
    return {"message": "Job deleted successfully"}

# ===================== STATISTICS ENDPOINTS =====================

@app.get("/api/stats")
def get_stats(request: Request, db: Session = Depends(get_db)):
    """Get website statistics"""
    try:
        track_visit(request, db)
    except:
        pass
    
    total_visits = db.query(func.count(models.UserVisit.id)).scalar()
    unique_visitors = db.query(func.count(func.distinct(models.UserVisit.ip_address))).scalar()
    total_jobs = db.query(func.count(models.Job.id)).filter(models.Job.is_active == True).scalar()
    
    return {
        "total_visits": total_visits or 0,
        "unique_visitors": unique_visitors or 0,
        "total_jobs": total_jobs or 0
    }

@app.get("/api/stats/jobs/{job_id}")
def get_job_stats(job_id: int, db: Session = Depends(get_db)):
    """Get statistics for a specific job"""
    views = db.query(func.count(models.UserVisit.id)).filter(
        models.UserVisit.job_id == job_id
    ).scalar()
    
    return {"job_id": job_id, "views": views or 0}

# ===================== SEARCH ENDPOINTS =====================

@app.get("/api/search")
def search_jobs(
    q: str = "",
    years: str = "",
    location: str = "",
    request: Request = None,
    db: Session = Depends(get_db)
):
    """Search jobs by query, years, and location"""
    if request:
        try:
            track_visit(request, db)
        except:
            pass
    
    query = db.query(models.Job).filter(models.Job.is_active == True)
    
    if q:
        search_term = f"%{q}%"
        query = query.filter(
            (models.Job.job_name.ilike(search_term)) |
            (models.Job.company.ilike(search_term)) |
            (models.Job.job_description.ilike(search_term))
        )
    
    if years:
        query = query.filter(models.Job.eligible_years.ilike(f"%{years}%"))
    
    if location:
        query = query.filter(models.Job.location.ilike(f"%{location}%"))
    
    jobs = query.order_by(desc(models.Job.created_at)).all()
    return jobs

@app.get("/api/years")
def get_available_years(db: Session = Depends(get_db)):
    """Get all available experience years"""
    jobs = db.query(models.Job.eligible_years).filter(
        models.Job.is_active == True,
        models.Job.eligible_years.isnot(None)
    ).all()
    
    years_set = set()
    for job in jobs:
        if job.eligible_years:
            years_list = [y.strip() for y in str(job.eligible_years).split(",")]
            years_set.update(years_list)
    
    return sorted(list(years_set))

@app.get("/api/locations")
def get_available_locations(db: Session = Depends(get_db)):
    """Get all available locations"""
    locations = db.query(models.Job.location).filter(
        models.Job.is_active == True
    ).distinct().all()
    
    return [loc[0] for loc in locations if loc[0]]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
