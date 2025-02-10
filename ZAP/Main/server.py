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

cursor = conn.cursor()


with open("zap_results.json", "r") as file:
    json_data = json.load(file)


insert_query = """
INSERT INTO zap_scan_results (
    sourceid, plugin_id, cwe_id, confidence, risk, alert, description,
    url, evidence, method, reference, solution, param, attack, wascid, tags
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""


for entry in json_data:
    cursor.execute(insert_query, (
        entry.get("sourceid"),
        entry.get("pluginId"),
        entry.get("cweid"),
        entry.get("confidence"),
        entry.get("risk"),
        entry.get("alert"),
        entry.get("description"),
        entry.get("url"),
        entry.get("evidence"),
        entry.get("method"),
        entry.get("reference"),
        entry.get("solution"),
        entry.get("param"),
        entry.get("attack"),
        entry.get("wascid"),
        json.dumps(entry.get("tags", {}))  
    ))


conn.commit()
cursor.close()
conn.close()
print("✅ ZAP Scan results saved to PostgreSQL successfully.")