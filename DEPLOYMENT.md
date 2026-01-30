# Deployment Guide

Choose your preferred deployment platform. All options below are free or have a free tier.

## Option 1: Railway (Recommended - Easiest)

Railway is the easiest option with automatic deployment from GitHub.

### Steps:

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/Ajaysanepalle/job-portal.git
   git branch -M main
   git push -u origin main
   ```

2. **Go to Railway.app**
   - Visit https://railway.app
   - Sign up with GitHub
   - Click "Create New Project"
   - Select "Deploy from GitHub repo"
   - Choose your job-portal repository

3. **Configure Service**
   - Railway will detect it's a Python project
   - Set Start Command: `cd backend && python main.py`
   - Set Port: 8000

4. **Set Environment Variables**
   - Go to Variables
   - Add: `DATABASE_URL=sqlite:///job_portal.db`
   - Add: `ADMIN_USERNAME=admin`
   - Add: `ADMIN_PASSWORD=admin123` (change this!)

5. **Deploy**
   - Click Deploy
   - Wait for build to complete
   - Your app will be live at a Railway domain

---

## Option 2: Heroku

### Steps:

1. **Install Heroku CLI**
   ```bash
   # Windows: Download from https://devcenter.heroku.com/articles/heroku-cli
   # Or use: choco install heroku-cli
   
   # Mac: brew tap heroku/brew && brew install heroku
   # Linux: curl https://cli-assets.heroku.com/install.sh | sh
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-job-portal-app
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View Logs**
   ```bash
   heroku logs --tail
   ```

---

## Option 3: Render.com

### Steps:

1. **Go to Render.com**
   - Visit https://render.com
   - Sign up

2. **Create New Web Service**
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repository
   - Select job-portal repo

3. **Configure**
   - Name: job-portal
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `cd backend && gunicorn -w 4 -b 0.0.0.0:$PORT main:app`

4. **Environment Variables**
   - Add DATABASE_URL
   - Add ADMIN credentials

5. **Deploy**
   - Click "Create Web Service"

---

## Option 4: PythonAnywhere + GitHub Pages

### Backend on PythonAnywhere:

1. **Go to PythonAnywhere.com**
   - Sign up for free account

2. **Upload Code**
   - Use Web tab → Add new web app
   - Upload your backend code

3. **Configure WSGI**
   - Set up WSGI configuration
   - Point to FastAPI app

### Frontend on GitHub Pages:

1. **Create gh-pages Branch**
   ```bash
   git checkout -b gh-pages
   cd frontend
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push -u origin gh-pages
   ```

2. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Select gh-pages branch
   - Save

---

## Option 5: Docker + Any VPS

### Using Docker Locally First:

```bash
# Build Docker image
docker build -t job-portal ./backend

# Run container
docker run -p 8000:8000 job-portal
```

### Deploy to VPS (AWS EC2, DigitalOcean, etc.):

1. **SSH into VPS**
   ```bash
   ssh user@your-vps-ip
   ```

2. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   ```

3. **Clone Repository**
   ```bash
   git clone https://github.com/Ajaysanepalle/job-portal.git
   cd job-portal
   ```

4. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

---

## Option 6: Manual Deployment on VPS

### On DigitalOcean ($5-6/month):

1. **Create Droplet**
   - Choose Ubuntu 22.04
   - Select $5-6/month plan

2. **SSH into Droplet**
   ```bash
   ssh root@your-droplet-ip
   ```

3. **Install Dependencies**
   ```bash
   apt update && apt upgrade
   apt install python3-pip python3-venv nginx
   ```

4. **Clone Repository**
   ```bash
   git clone https://github.com/Ajaysanepalle/job-portal.git
   cd job-portal/backend
   ```

5. **Setup Virtual Environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

6. **Run with Gunicorn**
   ```bash
   gunicorn -w 4 -b 127.0.0.1:8000 main:app
   ```

7. **Configure Nginx**
   ```bash
   # Edit /etc/nginx/sites-available/default
   # Add reverse proxy configuration for backend
   # Point root to frontend folder
   ```

8. **Use Systemd Service** (to keep running)
   ```bash
   # Create /etc/systemd/system/job-portal.service
   # Add service configuration
   # Start: systemctl start job-portal
   ```

---

## Option 7: AWS Lambda + S3

### Backend on Lambda:

1. **Install SAM CLI**
   ```bash
   pip install aws-sam-cli
   ```

2. **Deploy Backend**
   ```bash
   sam deploy --guided
   ```

### Frontend on S3:

1. **Create S3 Bucket**
   - Enable static website hosting
   - Upload frontend files

2. **Use CloudFront** for CDN distribution

---

## Domain Setup (manaworks.online)

### If you already have manaworks.online:

1. **Update DNS Records**
   - Go to your domain registrar
   - Point A record to your deployment server IP

2. **For Railway/Render/Heroku**
   - Add CNAME record
   - Point to their provided domain

3. **SSL/HTTPS**
   - Most platforms provide free SSL
   - Or use Let's Encrypt

---

## Best Free Tier Options (Ranked)

1. **Railway** - Easiest, $5/month free credit
2. **Render** - Very easy, generous free tier
3. **PythonAnywhere** - Best for Python, free tier available
4. **Heroku** - Used to be best, limited free now
5. **DigitalOcean** - $5-6/month, reliable

---

## Environment Variables to Change

Before deploying, change these in `.env`:

```
ADMIN_USERNAME=your_username    # Change from 'admin'
ADMIN_PASSWORD=your_password    # Change from 'admin123'
SECRET_KEY=random_string        # Generate random string
DATABASE_URL=postgresql://...   # If using PostgreSQL
```

---

## Post-Deployment Checklist

- [ ] Change admin password
- [ ] Test all features
- [ ] Enable HTTPS/SSL
- [ ] Set up proper logging
- [ ] Configure backups
- [ ] Test search functionality
- [ ] Test admin panel
- [ ] Mobile responsiveness check

---

## Troubleshooting

**App won't start?**
- Check logs for errors
- Verify all dependencies installed
- Check environment variables set

**Database errors?**
- Ensure SQLite or PostgreSQL is accessible
- Check database URL in environment

**CORS errors?**
- Check frontend and backend URLs match
- Verify CORS is enabled in main.py

**Slow performance?**
- Use database indexes
- Consider caching layer
- Upgrade to paid tier

---

## Need Help?

- Check README.md for local setup
- Check QUICKSTART.md for running locally
- Review API docs at /docs endpoint

**Good luck with your deployment! 🚀**
