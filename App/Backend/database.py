import sqlite3
import os

DATABASE_FILE = "app.db"

def get_db_connection():
    conn = sqlite3.connect(DATABASE_FILE)
    conn.row_factory = sqlite3.Row  
    return conn

def init_db():
    if not os.path.exists(DATABASE_FILE):
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
""")
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS passwords (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            password_name TEXT NOT NULL,
            secure_password TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
    )""")
        
        conn.commit()
        conn.close()
        print("Database and 'users' table created successfully!")
        