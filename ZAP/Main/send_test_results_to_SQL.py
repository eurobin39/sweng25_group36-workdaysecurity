import psycopg2
import json
import os
from dotenv import load_dotenv


load_dotenv()


conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)

print(f"{os.getenv("DB_USER")}");

cursor = conn.cursor()


with open("ZAP/Main/security_results.json", "r", encoding="utf-8") as file:
    json_data = json.load(file)


insert_query = """
INSERT INTO security_test_results (
    test_result, risk, confidence, alert, description
) VALUES (%s, %s, %s, %s, %s)
"""


for entry in json_data:
    cursor.execute(insert_query, (
        entry.get("test result"),
        entry.get("risk"),
        entry.get("confidence"),
        entry.get("alert"),
        entry.get("description")
    ))


conn.commit()
cursor.close()
conn.close()

print("✅ Security test results saved to PostgreSQL successfully.")
