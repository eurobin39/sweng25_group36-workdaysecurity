import sys
import os
import psycopg2
import json
from config import config
from datetime import datetime

# 🔹 Get the script directory
# script_dir = os.path.dirname(os.path.abspath(__file__))
json_file_path = sys.argv[1]
# json_file_path = os.path.join(script_dir, "..", "data", "output.json")

# 🔹 Verify Database Connection Details
print("🔹 DB Connection Details:")
print(f"DB_NAME: {config.db_name}")
print(f"DB_USER: {config.db_user}")
print(f"DB_HOST: {config.db_host}")
print(f"DB_PORT: {config.db_port}")

# 🔹 Connect to PostgreSQL
try:
    conn = psycopg2.connect(
        dbname=config.db_name,
        user=config.db_user,
        password=config.db_password,
        host=config.db_host,
        port=config.db_port
    )
    print("✅ Connected to PostgreSQL")
except psycopg2.OperationalError as e:
    print(f"❌ Database connection failed: {e}")
    exit(1)

cursor = conn.cursor()

# 🔹 Check if JSON file exists
if not os.path.exists(json_file_path):
    print(f"❌ JSON file not found: {json_file_path}")
    exit(1)

# 🔹 Load JSON data
print(f"🔍 Loading JSON file: {json_file_path}")
with open(json_file_path, "r", encoding="utf-8") as file:
    json_data = json.load(file)

print("📄 JSON Data Preview:", json_data)  # Display the JSON data for verification
print("🔍 Loaded JSON Data Type:", type(json_data))

# 🔹 Ensure JSON data is a list
if not isinstance(json_data, list):
    print("❌ JSON data is not a list. Expected a list of test results.")
    exit(1)

# 🔹 SQL Query for Inserting Security Test Results
insert_results_query = """
INSERT INTO security_test_results (
    commit_hash, timestamp, repository, branch, runner, project_id,
    test_name, test_type, test_category, status, duration, vulnerability_found
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
ON CONFLICT (commit_hash) DO NOTHING;
"""

# 🔹 SQL Query for Inserting Assertions (Linked to commit_hash)
insert_assertions_query = """
INSERT INTO assertions (
    commit_hash, name, status, expected, actual, risk, confidence, message
) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
"""

# 🔹 Process Each Test Result Entry in JSON
for test_entry in json_data:
    metadata = test_entry.get("metadata", {})
    test_info = test_entry.get("testInfo", {})
    results = test_entry.get("results", {})

    # ✅ Extract Metadata Fields
    timestamp = metadata.get("timestamp", datetime.now().isoformat())
    repository = metadata.get("repository", "unknown")
    branch = metadata.get("branch", "unknown")
    commit_hash = metadata.get("commitHash", "unknown")
    runner = metadata.get("runner", "unknown")
    project_id = metadata.get("projectId", "unknown")

    # ✅ Extract Test Info Fields
    test_name = test_info.get("name", "unknown")
    test_type = test_info.get("type", "unknown")
    test_category = test_info.get("category", "unknown")

    # ✅ Extract Result Fields
    status = results.get("status", "unknown")
    duration = results.get("duration", 0)
    vulnerability_found = results.get("vulnerabilityFound", False)

    # 🔹 Insert Security Test Result into Database
    cursor.execute(insert_results_query, (
        commit_hash, timestamp, repository, branch, runner, project_id,
        test_name, test_type, test_category, status, duration, vulnerability_found
    ))

    # 🔹 Process Assertions if Available
    assertions = results.get("assertions", [])
    for assertion in assertions:
        assertion_name = assertion.get("name", "unknown")
        assertion_status = assertion.get("status", "unknown")
        expected = assertion.get("expected", "")
        actual = assertion.get("actual", "")
        risk = assertion.get("risk", "NA")
        confidence = assertion.get("confidence", "NA")
        message = assertion.get("message", "")

        # ✅ Insert Assertion into Database (Linked to commit_hash)
        cursor.execute(insert_assertions_query, (
            commit_hash, assertion_name, assertion_status, expected, actual, risk, confidence, message
        ))

# 🔹 Commit and Close DB Connection
conn.commit()
cursor.close()
conn.close()

print("✅ Security test results successfully stored in PostgreSQL!")
