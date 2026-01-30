@echo off
REM Job Portal Setup Script for Windows

echo.
echo 🚀 Job Portal Setup Script
echo ==========================
echo.

REM Check Python version
python --version

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo ✓ Virtual environment created
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
cd backend
pip install -r requirements.txt
cd ..

echo.
echo ✅ Setup Complete!
echo.
echo To get started:
echo.
echo 1. Terminal 1 - Backend:
echo    venv\Scripts\activate.bat
echo    cd backend
echo    python main.py
echo.
echo 2. Terminal 2 - Frontend:
echo    cd frontend
echo    python -m http.server 8080
echo.
echo 3. Open http://localhost:8080 in your browser
echo.
echo Admin Credentials:
echo   Username: admin
echo   Password: admin123
echo.
pause
