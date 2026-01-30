<!-- HTML version for GitHub display -->
<div align="center">

# 💼 ManaWorks Job Portal

A modern, beautiful job posting website built with **FastAPI** and **Vanilla JavaScript**.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-Ajaysanepalle-black.svg)](https://github.com/Ajaysanepalle)

[Features](#-features) • [Quick Start](#-quick-start) • [Deploy](#-deployment) • [API Docs](#-api-endpoints) • [Contributing](#-contributing)

</div>

---

## 🎯 Features

### 👨‍💼 Admin Panel
- ✅ **Secure Login** - Admin authentication required
- ✅ **Post Jobs** - Add detailed job listings
- ✅ **Update Jobs** - Modify existing postings
- ✅ **Delete Jobs** - Remove job listings
- ✅ **View Analytics** - Track visitor statistics
- ✅ **Manage Listings** - See all your posted jobs

### 👥 User Features
- ✅ **Beautiful UI** - Modern responsive design
- ✅ **Search Jobs** - Find by title, company, description
- ✅ **Filter by Experience** - Browse by career level
- ✅ **Filter by Location** - Find jobs in your city
- ✅ **Experience Tabs** - Quick navigation by level
- ✅ **Job Details** - View full job information
- ✅ **Apply Now** - Direct link to application

### 📊 Analytics
- ✅ **Visitor Tracking** - See total site visits
- ✅ **Unique Visitors** - Track unique IP addresses
- ✅ **Job Views** - Monitor per-job engagement
- ✅ **Real-time Stats** - Instant statistics

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- pip or pip3

### Installation (2 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run backend (Terminal 1)
python main.py
```

```bash
# 4. In new terminal, run frontend (Terminal 2)
cd frontend
python -m http.server 8080
```

### 3. Open Browser
```
http://localhost:8080
```

### 4. Login
```
Username: admin
Password: admin123
```

---

## 📁 Project Structure

```
job-portal/
│
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── database.py          # Database configuration
│   ├── auth.py              # Authentication logic
│   ├── schemas.py           # Data validation schemas
│   ├── requirements.txt     # Python dependencies
│   ├── .env                 # Environment variables
│   ├── Dockerfile           # Docker configuration
│   ├── Procfile             # Heroku deployment
│   └── pyproject.toml       # Poetry configuration
│
├── frontend/
│   ├── index.html           # Main HTML page
│   ├── styles.css           # Complete styling
│   ├── app.js               # Frontend logic
│   └── netlify.toml         # Netlify config
│
├── docker-compose.yml       # Docker Compose setup
├── DEPLOYMENT.md            # Deployment guide
├── QUICKSTART.md            # Quick start guide
├── STARTUP.md               # Detailed startup
├── README.md                # Full documentation
├── SETUP_SUMMARY.md         # Setup summary
├── setup.bat                # Windows setup script
├── setup.sh                 # Linux/Mac setup
└── .gitignore              # Git ignore rules
```

---

## 📋 Job Posting Fields

When posting a job, provide:
- **Job Name** - Title of the position
- **Company** - Company name
- **Description** - Full job details
- **Eligible Years** - Experience requirement (e.g., "0-2, 2-5, 5+")
- **Qualification** - Required qualification (B.Tech, B.Sc, etc.)
- **Link** - Application URL
- **Location** - Job location/city
- **Last Date** - Application deadline

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/admin/login        - Admin login
POST   /api/admin/logout       - Admin logout
GET    /api/admin/verify       - Verify token
```

### Job Management
```
POST   /api/jobs               - Create job (admin)
GET    /api/jobs               - Get all jobs
GET    /api/jobs/{id}          - Get specific job
PUT    /api/jobs/{id}          - Update job (admin)
DELETE /api/jobs/{id}          - Delete job (admin)
```

### Search & Filters
```
GET    /api/search             - Search jobs
GET    /api/years              - Get experience levels
GET    /api/locations          - Get locations
```

### Statistics
```
GET    /api/stats              - Website statistics
GET    /api/stats/jobs/{id}    - Job-specific stats
```

### Interactive Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## 🌐 Deployment

### Option 1: Railway (Recommended)
```bash
# 1. Push to GitHub
git push origin main

# 2. Connect to Railway.app
# 3. Auto-deploys with free credits

# Result: Live in 2 minutes!
```

### Option 2: Heroku
```bash
heroku login
heroku create your-job-portal
git push heroku main
```

### Option 3: Render.com
```bash
# Connect GitHub → Select repo → Deploy
# Auto-deploys on push
```

### Option 4: Your Own VPS
```bash
docker-compose up -d
```

📖 **[Complete Deployment Guide →](DEPLOYMENT.md)**

---

## 🔐 Security

### Default Credentials
```
Username: admin
Password: admin123
```

⚠️ **IMPORTANT**: Change these before production!

### Security Features
- Admin authentication required
- Token-based session management
- CORS enabled
- SQL injection prevention (SQLAlchemy ORM)
- Input validation (Pydantic)

### Environment Variables
```env
DATABASE_URL=sqlite:///job_portal.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
SECRET_KEY=your-secret-key
```

---

## 💻 Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Backend | FastAPI 0.104 | API Server |
| Server | Uvicorn | ASGI Server |
| Database | SQLite | Data Storage |
| ORM | SQLAlchemy 2.0 | Database Layer |
| Frontend | HTML5/CSS3/JS | User Interface |
| Auth | Custom Tokens | Security |

---

## 📊 Database Schema

### Admins Table
```sql
id          INTEGER PRIMARY KEY
username    STRING UNIQUE
password    STRING (hashed)
email       STRING UNIQUE
created_at  DATETIME
```

### Jobs Table
```sql
id               INTEGER PRIMARY KEY
job_name         STRING
company          STRING
job_description  TEXT
eligible_years   STRING
qualification    STRING
link             STRING
location         STRING
last_date        STRING
admin_id         INTEGER
is_active        BOOLEAN
created_at       DATETIME
updated_at       DATETIME
```

### User Visits Table
```sql
id          INTEGER PRIMARY KEY
ip_address  STRING
user_agent  STRING
job_id      INTEGER (nullable)
visited_at  DATETIME
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Backend starts without errors
- [ ] Frontend loads in browser
- [ ] Admin login works
- [ ] Can post a job
- [ ] Job appears in listing
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Can update job
- [ ] Can delete job
- [ ] Statistics display correctly
- [ ] Mobile responsive
- [ ] No console errors

### API Testing
```bash
# Get all jobs
curl http://localhost:8000/api/jobs

# Admin login
curl -X POST http://localhost:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Get stats
curl http://localhost:8000/api/stats
```

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use**
```bash
# Use different port
python main.py --port 9000
```

**Module not found**
```bash
pip install -r requirements.txt
```

**Database locked**
```bash
rm backend/job_portal.db
python main.py  # Will recreate
```

### Frontend Issues

**Can't connect to backend**
- Verify backend is running on port 8000
- Check `API_BASE` in `frontend/app.js`
- Check browser console (F12)

**Port 8080 in use**
```bash
python -m http.server 8081
```

### Login Issues

**Wrong credentials**
- Default: `admin` / `admin123`
- Check `.env` file for custom credentials

**Token expired**
- Logout and login again
- Clear browser cache

---

## 📖 Documentation

- 📘 [Full README](README.md) - Comprehensive guide
- 🚀 [Quick Start](QUICKSTART.md) - 5-minute setup
- 📱 [Startup Guide](STARTUP.md) - Detailed startup
- 🌐 [Deployment Guide](DEPLOYMENT.md) - Production deployment
- 📋 [Setup Summary](SETUP_SUMMARY.md) - Feature overview

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup
```bash
git clone https://github.com/Ajaysanepalle/job-portal.git
cd job-portal
pip install -r backend/requirements.txt
python backend/main.py  # Terminal 1
python -m http.server 8080 -d frontend  # Terminal 2
```

---

## 🗺️ Roadmap

- [ ] User registration
- [ ] Job applications tracking
- [ ] Email notifications
- [ ] Advanced admin analytics
- [ ] Job categories
- [ ] Saved jobs feature
- [ ] Resume upload
- [ ] Social sharing
- [ ] PostgreSQL support
- [ ] Docker Hub image

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💼 Author

**Ajaysanepalle**
- GitHub: [@Ajaysanepalle](https://github.com/Ajaysanepalle)
- Website: [manaworks.online](https://manaworks.online)

---

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Styled with modern CSS3 gradients
- Icons by [Font Awesome](https://fontawesome.com/)
- Deployed on [Railway](https://railway.app/)

---

## 📞 Support

- **Issues**: Create a GitHub issue
- **Questions**: Check documentation
- **Suggestions**: Feel free to reach out

---

## 💡 Quick Tips

1. **Change colors**: Edit `--primary-color` in `frontend/styles.css`
2. **Change admin password**: Update `backend/.env`
3. **Use PostgreSQL**: Change `DATABASE_URL` in `.env`
4. **Deploy**: Push to GitHub, connect to Railway
5. **Custom domain**: Update DNS to point to deployment

---

<div align="center">

### ⭐ If you find this helpful, please give it a star!

### 🚀 Ready to deploy? [See Deployment Guide](DEPLOYMENT.md)

**Made with ❤️ for job seekers and companies**

</div>
