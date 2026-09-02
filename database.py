import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",
        port=1234,              # Your custom psql port
        database="flavorhouse", # Your database name
        user="postgres",        # Update if using a different user
        password="Livermore" # Replace with your actual password
    )
    return conn