from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI(title="Flavorhouse API")

# Configure CORS to allow requests from your React development server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_connection():
    conn = psycopg2.connect(
        dbname="flavorhouse",
        user="postgres",
        password="Livermore",  # Replace with your actual PostgreSQL password
        host="localhost",
        port="1234",
        cursor_factory=RealDictCursor,
    )
    return conn


@app.get("/")
def read_root():
    return {
        "message": "Welcome to Flavorhouse Restaurant API",
        "docs": "/docs",
        "status": "operational",
    }


@app.get("/menu-items")
@app.get("/menu_items")
def get_all_menu_items():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Query matching exact database column names:
    # item_name, prep_time_mins, calories, is_chefs_choice, is_bestseller
    query = """
        SELECT 
            item_id, 
            item_name AS name, 
            prep_time_mins AS time_to_cook, 
            calories, 
            is_chefs_choice, 
            is_bestseller 
        FROM menu_items 
        ORDER BY item_id ASC;
    """
    cursor.execute(query)
    items = cursor.fetchall()

    cursor.close()
    conn.close()

    response_data = []
    for item in items:
        tags = []
        if item.get("is_chefs_choice"):
            tags.append("Chef's Choice")
        if item.get("is_bestseller"):
            tags.append("Bestseller")

        response_data.append({
            "item_id": item.get("item_id"),
            "name": item.get("name"),
            "time_to_cook": item.get("time_to_cook"),
            "calories": item.get("calories"),
            "tags": tags,
        })

    return response_data