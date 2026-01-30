# Job Portal - Getting Started Guide

## Quick Start (5 minutes)

### 1. Install Python Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Run Backend Server
```bash
cd backend
python main.py
```
✅ Backend running at: http://localhost:8000

### 3. Run Frontend (New Terminal)
```bash
cd frontend
python -m http.server 8080
```
✅ Frontend running at: http://localhost:8080

### 4. Login to Admin Panel
- Click "Admin Login"
- **Username**: `admin`
- **Password**: `admin123`

---

## Admin Features

### Post a Job
1. Login to Admin Panel
2. Go to "Add Job" tab
3. Fill in all fields:
   - Job Name
   - Company
   - Description
   - Experience Level (e.g., "0-2, 2-5, 5+")
   - Qualification
   - Application Link
   - Location
   - Last Date to Apply
4. Click "Post Job"

### Manage Jobs
- Edit existing jobs
- Delete jobs
- View your postings

### View Statistics
- Total website visits
- Unique visitors
- Total jobs posted

---

## User Features

### Search Jobs
- Type job title, company name, or description
- Click Search or press Enter

### Filter Jobs
- Filter by experience level
- Filter by location
- See jobs in different tabs

### View Job Details
- Click any job card
- See full job information
- Click "Apply Now" to apply

---

## API Endpoints

All API endpoints are documented. Access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## Deployment

See [README.md](./README.md) for deployment options:
- Heroku (Free)
- Railway (Free)
- Render.com (Free)
- Vercel + Backend combination

---

## Environment Variables

Edit `backend/.env`:
```
DATABASE_URL=sqlite:///job_portal.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

---

## Troubleshooting

**Backend not starting?**
- Check Python version: `python --version` (need 3.8+)
- Install dependencies: `pip install -r requirements.txt`
- Check port 8000 is not in use

**Frontend not loading?**
- Try different port: `python -m http.server 8081`
- Check JavaScript console for errors (F12)

**Can't login?**
- Check backend is running
- Default credentials: admin / admin123
- Check browser console for errors

**CORS errors?**
- Backend CORS is enabled for all origins
- Check both frontend and backend URLs are correct

---

## Git Setup

```bash
# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial job portal commit"

# Add remote (replace with your GitHub repo)
git remote add origin https://github.com/Ajaysanepalle/job-portal.git

# Push
git push -u origin main
```

---

**Questions?** Check the main README.md file or GitHub Issues.
