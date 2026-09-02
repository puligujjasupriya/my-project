from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import get_db_connection
from psycopg2.extras import RealDictCursor

app = FastAPI(title="Flavorhouse API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://localhost:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test Route
@app.get("/")
def home():
    return {"message": "Welcome to Flavorhouse API"}

# Get All Menu Items
@app.get("/menu-items")
def get_all_menu_items():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT * FROM menu_items ORDER BY item_id ASC;")
    items = cursor.fetchall()
    
    cursor.close()
    conn.close()
    return items

# Get Single Item by ID
@app.get("/menu-items/{item_id}")
def get_menu_item(item_id: int):
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT * FROM menu_items WHERE item_id = %s;", (item_id,))
    item = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item



# Get All Menu Items with details
@app.get("/menu-items")
def get_all_menu_items():
    conn = get_db_connection()
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    # Query selecting specific fields including tags, time to cook, calories, and name
    query = """
        SELECT 
            item_id,
            name,
            time_to_cook,
            calories,
            is_chef_choice,
            is_bestseller
        FROM menu_items;
    """
    cursor.execute(query)
    items = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    # Process items to format chef_choice and bestseller as a list of tags
    response_data = []
    for item in items:
        tags = []
        if item.get("is_chef_choice"):
            tags.append("Chef's Choice")
        if item.get("is_bestseller"):
            tags.append("Bestseller")
            
        response_data.append({
            "item_id": item["item_id"],
            "name": item["name"],
            "time_to_cook": item["time_to_cook"],
            "calories": item["calories"],
            "tags": tags
        })
        
    return response_data