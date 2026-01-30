# Complete Startup Guide

## 🚀 Quick Start (Choose One Method)

### Method 1: Windows Batch Script (Easiest for Windows)

```bash
cd c:\Users\spava\OneDrive\Desktop\One\job-portal
setup.bat
```

Then in **Terminal 1**:
```bash
venv\Scripts\activate.bat
cd backend
python main.py
```

Then in **Terminal 2**:
```bash
cd frontend
python -m http.server 8080
```

---

### Method 2: Manual Setup (Windows, Mac, Linux)

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
python -m http.server 8080
```

---

### Method 3: Docker (if installed)

```bash
docker-compose up
```

Access:
- Backend: http://localhost:8000
- Frontend: http://localhost:8080

---

## ✅ Verify Everything Works

1. **Backend Running?**
   - Visit http://localhost:8000/docs
   - Should see API documentation

2. **Frontend Running?**
   - Visit http://localhost:8080
   - Should see beautiful job portal

3. **Admin Login**
   - Click "Admin Login" button
   - Username: `admin`
   - Password: `admin123`
   - Click "Post Job" and add a test job

4. **Job Displays?**
   - Refresh page
   - Should see job in list

5. **Search Works?**
   - Try searching
   - Try filtering by experience/location

---

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── models.py            # Database models
│   ├── database.py          # DB config
│   ├── auth.py              # Authentication
│   ├── schemas.py           # Data schemas
│   ├── requirements.txt     # Python packages
│   ├── .env                 # Env variables
│   ├── Dockerfile           # Docker config
│   └── Procfile             # Heroku config
│
├── frontend/
│   ├── index.html           # Main page
│   ├── styles.css           # Styling
│   ├── app.js               # JavaScript logic
│   └── netlify.toml         # Netlify config
│
├── docker-compose.yml       # Docker Compose
├── README.md                # Full documentation
├── QUICKSTART.md            # Quick setup
├── DEPLOYMENT.md            # Deployment guide
├── STARTUP.md               # This file
└── setup.bat/.sh            # Setup scripts
```

---

## 🎯 Admin Features

### Add a Job
1. Click "Admin Login"
2. Go to "Add Job" tab
3. Fill all fields
4. Click "Post Job"

### Manage Jobs
- Go to "Manage Jobs" tab
- Edit or Delete jobs

### View Stats
- Go to "Statistics" tab
- See visitor counts

---

## 👥 User Features

- **Search**: Type job title or company
- **Filter**: By experience level or location
- **Tabs**: View jobs by experience level
- **Apply**: Click "Apply Now" button

---

## 🔧 Troubleshooting

**"Port already in use"**
```bash
# Use different port
python -m http.server 8081  # Frontend on 8081
python -c "import uvicorn; uvicorn.run('main:app', port=9000)"  # Backend on 9000
```

**"Module not found"**
```bash
pip install -r requirements.txt
```

**"Can't connect to backend"**
- Make sure backend is running on port 8000
- Check firewall settings
- Check API_BASE in app.js

**"Database locked"**
```bash
# Remove old database
rm backend/job_portal.db

# Restart backend
python backend/main.py
```

---

## 🌐 API Endpoints

Test these in your browser or with cURL:

```bash
# Get all jobs
curl http://localhost:8000/api/jobs

# Login admin
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get stats
curl http://localhost:8000/api/stats

# Swagger UI (interactive)
http://localhost:8000/docs
```

---

## 📝 Default Credentials

```
Username: admin
Password: admin123
```

**⚠️ Change these before production!**

---

## 🚀 Next Steps

1. **Customize**
   - Change admin password in backend/.env
   - Add your branding/logo
   - Customize colors in frontend/styles.css

2. **Add More Jobs**
   - Use admin panel to post jobs
   - Test search and filters

3. **Deploy**
   - Choose deployment platform (see DEPLOYMENT.md)
   - Push to GitHub
   - Deploy to Railway/Render/Heroku

4. **Domain**
   - Connect manaworks.online
   - Set up HTTPS/SSL

---

## 📞 Support

- **Documentation**: See README.md
- **Deployment Help**: See DEPLOYMENT.md
- **Code Issues**: Check GitHub Issues
- **Local Problems**: See Troubleshooting section above

---

## ✨ Features Summary

✅ Admin Login (no signup for users)
✅ Post Jobs (Job name, company, description, years, qualification, link, location, last date)
✅ Update Jobs
✅ Delete Jobs
✅ Beautiful Frontend
✅ Search Feature
✅ Experience Level Tabs
✅ Location Filtering
✅ Visit Tracking (user count)
✅ Responsive Design
✅ Ready for Deployment

---

**You're all set! Enjoy your job portal! 🎉**
