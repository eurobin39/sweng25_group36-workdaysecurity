import os
import psycopg2
import json
from config import config

# 현재 스크립트의 절대 경로 구하기
script_dir = os.path.dirname(os.path.abspath(__file__))
json_file_path = os.path.join(script_dir, "..", "data", "output.json")

# 환경 변수 확인
print("🔹 DB Connection Details:")
print(f"DB_NAME: {config.db_name}")
print(f"DB_USER: {config.db_user}")
print(f"DB_PASSWORD: {config.db_password}")  # 보안 문제로 실제 실행 시 제거 가능
print(f"DB_HOST: {config.db_host}")
print(f"DB_PORT: {config.db_port}")

# PostgreSQL 연결
try:
    conn = psycopg2.connect(
        dbname=config.db_name,
        user=config.db_user,
        password=config.db_password,
        host=config.db_host,
        port=config.db_port
    )
    print("✅ Connected to PostgreSQL:", conn)
except psycopg2.OperationalError as e:
    print(f"❌ Database connection failed: {e}")
    exit(1)

cursor = conn.cursor()

# JSON 파일 존재 여부 확인
if not os.path.exists(json_file_path):
    print(f"❌ JSON 파일이 존재하지 않습니다: {json_file_path}")
    exit(1)

# JSON 파일 로드
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
