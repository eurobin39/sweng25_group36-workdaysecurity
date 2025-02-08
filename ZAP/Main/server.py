import psycopg2
import json
import os 
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# PostgreSQL 연결
conn = psycopg2.connect(
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT")
)

cursor = conn.cursor()

# JSON 파일 읽기
with open("zap_results.json", "r") as file:
    json_data = json.load(file)

# SQL 쿼리 (INSERT INTO)
insert_query = """
INSERT INTO zap_scan_results (
    sourceid, plugin_id, cwe_id, confidence, risk, alert, description,
    url, evidence, method, reference, solution, param, attack, wascid, tags
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# JSON 데이터 반복 삽입
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
        json.dumps(entry.get("tags", {}))  # JSON 데이터 저장
    ))

# 변경 사항 저장 및 종료
conn.commit()
cursor.close()
conn.close()
print("✅ ZAP Scan results saved to PostgreSQL successfully.")