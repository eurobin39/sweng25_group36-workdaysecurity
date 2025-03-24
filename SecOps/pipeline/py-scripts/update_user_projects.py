import sys
import os
import psycopg2
import json
from config import config

def update_user_projects(metadata_file_path):
    """Update user's projects in the database based on metadata."""
    try:
        # Load metadata
        with open(metadata_file_path, 'r', encoding='utf-8') as f:
            metadata = json.load(f)

        maintainer = metadata.get('maintainer')
        project_name = metadata.get('projectName')

        if not maintainer or not project_name:
            print("❌ Missing required metadata: maintainer or project name")
            return False

        # Connect to PostgreSQL
        conn = psycopg2.connect(
            dbname=config.db_name,
            user=config.db_user,
            password=config.db_password,
            host=config.db_host,
            port=config.db_port
        )
        cursor = conn.cursor()

        # Check if user exists
        cursor.execute("SELECT id FROM \"User\" WHERE username = %s", (maintainer,))
        user = cursor.fetchone()

        if not user:
            print(f"❌ User not found: {maintainer}")
            return False

        # Check if project is already in user's projects array
        cursor.execute("""
            SELECT projects FROM "User" 
            WHERE username = %s AND %s = ANY(projects)
        """, (maintainer, project_name))
        
        if cursor.fetchone():
            print(f"✅ Project {project_name} already exists for user {maintainer}")
            return True

        # Add project to user's projects array
        cursor.execute("""
            UPDATE "User" 
            SET projects = array_append(projects, %s)
            WHERE username = %s
        """, (project_name, maintainer))

        conn.commit()
        print(f"✅ Added project {project_name} to user {maintainer}")
        return True

    except Exception as e:
        print(f"❌ Error updating user projects: {e}")
        return False
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python update_user_projects.py <metadata_file_path>")
        sys.exit(1)

    metadata_file_path = sys.argv[1]
    success = update_user_projects(metadata_file_path)
    sys.exit(0 if success else 1) 