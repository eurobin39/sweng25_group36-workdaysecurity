import psycopg2
import json
from config import config


conn = psycopg2.connect(
    dbname=config.db_name,
    user=config.db_user,
    password=config.db_password,
    host=config.db_host,
    port=config.db_port
)

cursor = conn.cursor()


with open("../data/output.json", "r", encoding="utf-8") as file:
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
