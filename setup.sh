#!/bin/bash

# Job Portal Setup Script for Linux/Mac

echo "🚀 Job Portal Setup Script"
echo "=========================="

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Activate virtual environment
echo "✓ Virtual environment created"
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Create database
echo "💾 Initializing database..."
cd backend
python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine)"
cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "To get started:"
echo "1. Terminal 1 - Backend:"
echo "   source venv/bin/activate"
echo "   cd backend"
echo "   python main.py"
echo ""
echo "2. Terminal 2 - Frontend:"
echo "   cd frontend"
echo "   python -m http.server 8080"
echo ""
echo "3. Open http://localhost:8080 in your browser"
echo ""
echo "Admin Credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo ""
