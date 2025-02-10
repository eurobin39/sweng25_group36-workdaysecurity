import psycopg2
import json
from config import config

# 환경 변수 확인
print("🔹 DB Connection Details:")
print(f"DB_NAME: {config.db_name}")
print(f"DB_USER: {config.db_user}")
print(f"DB_PASSWORD: {config.db_password}")  # 보안 문제로 실제 실행 시 제거 가능
print(f"DB_HOST: {config.db_host}")
print(f"DB_PORT: {config.db_port}")

# PostgreSQL 연결
conn = psycopg2.connect(
    dbname=config.db_name,
    user=config.db_user,
    password=config.db_password,
    host=config.db_host,
    port=config.db_port
)

print("✅ Connected to PostgreSQL:", conn)

cursor = conn.cursor()

# JSON 파일 확인
json_file_path = "../data/output.json"
print(f"🔍 Checking JSON file at: {json_file_path}")

with open(json_file_path, "r", encoding="utf-8") as file:
    json_data = json.load(file)

print("📄 JSON Data Preview:", json_data[:2])  # 데이터 미리보기 (앞 2개 출력)

# SQL 쿼리 실행
insert_query = """
INSERT INTO security_test_results (
    test_result, risk, confidence, alert, description
) VALUES (%s, %s, %s, %s, %s)
"""

for entry in json_data:
    print("➕ Inserting:", entry)  # 삽입할 데이터 확인
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
