#!/usr/bin/env python
"""
Create database tables for job portal
"""
import os
import sys
from sqlalchemy import create_engine
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///job_portal.db")

print(f"Connecting to: {DATABASE_URL}")

try:
    # Import models
    from models import Base
    
    # Create engine
    if "postgresql" in DATABASE_URL:
        engine = create_engine(DATABASE_URL)
    else:
        engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    
    # Test connection
    with engine.connect() as conn:
        print("✅ Database connection successful!")
    
    # Create all tables
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")
    
    # List tables
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"\nTables created: {tables}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    print("\nPossible issues:")
    print("1. PostgreSQL is not installed/running")
    print("2. Database 'job_portal' doesn't exist")
    print("3. Username/password is incorrect")
    print("\nSolutions:")
    print("- Make sure PostgreSQL is installed and running")
    print("- Create database: psql -U postgres -c \"CREATE DATABASE job_portal;\"")
    print("- Or switch back to SQLite in .env")
    sys.exit(1)
