import pandas as pd
import psycopg2
from psycopg2.extras import execute_values
import re
import os
from dotenv import load_dotenv

load_dotenv()
# Database connection parameters
db_params = {
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_DATABASE"),
    "user": os.getenv("DB_USERNAME"),
    "password": os.getenv("DB_PASSWORD"),
    "port": os.getenv("DB_PORT"),
    "sslmode": "require"
}

# Read the CSV file
df = pd.read_csv('new_odi_bbb2.csv')

# Clean column names (replace invalid characters with underscores)
df.columns = [re.sub(r'\W+', '', col).strip('').lower() for col in df.columns]

# Create a connection to the database
conn = psycopg2.connect(**db_params)
cursor = conn.cursor()

# Create the table
column_definitions = ', '.join('"{}" VARCHAR'.format(col) for col in df.columns)
create_table_query = "CREATE TABLE IF NOT EXISTS odi_db (id SERIAL PRIMARY KEY, {})".format(column_definitions)
cursor.execute(create_table_query)

# Prepare the data for insertion
data = [tuple(x) for x in df.to_numpy()]

# Insert the data
column_names = ', '.join('"{}"'.format(col) for col in df.columns)
insert_query = "INSERT INTO odi_db ({}) VALUES %s".format(column_names)
execute_values(cursor, insert_query, data)

# Commit the transaction and close the connection
conn.commit()
cursor.close()
conn.close()

print("Data imported successfully!")