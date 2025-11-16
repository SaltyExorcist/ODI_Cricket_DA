from dotenv import load_dotenv
import os

load_dotenv()
# Database connection parameters
db_params = {
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_DATABASE"),
    "user": os.getenv("DB_USERNAME"),
    "password": os.getenv("DB_PASSWORD")
}

print(db_params)