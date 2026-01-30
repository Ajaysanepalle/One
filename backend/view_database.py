#!/usr/bin/env python
"""
View SQLite database contents
"""
import sqlite3
import os

DB_PATH = "job_portal.db"

def view_database():
    """View all tables and their data"""
    
    if not os.path.exists(DB_PATH):
        print(f"❌ Database file not found: {DB_PATH}")
        return
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get all table names
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    
    print(f"📊 Database: {DB_PATH}")
    print(f"📋 Tables found: {len(tables)}\n")
    
    for table in tables:
        table_name = table[0]
        
        # Get column info
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        
        # Count rows
        cursor.execute(f"SELECT COUNT(*) FROM {table_name};")
        row_count = cursor.fetchone()[0]
        
        print(f"{'='*60}")
        print(f"📌 Table: {table_name}")
        print(f"   Rows: {row_count}")
        print(f"   Columns: {[col[1] for col in columns]}")
        print(f"{'='*60}")
        
        if row_count > 0:
            # Get all data
            cursor.execute(f"SELECT * FROM {table_name};")
            rows = cursor.fetchall()
            
            for row in rows:
                print(f"   {row}")
        else:
            print("   (No data yet)")
        
        print()
    
    conn.close()
    print("✅ Done!")

if __name__ == "__main__":
    view_database()
