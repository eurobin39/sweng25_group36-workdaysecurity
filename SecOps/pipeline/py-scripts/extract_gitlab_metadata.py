import os
import json
import subprocess
from datetime import datetime, timezone

def get_git_info():
    """Fetch Git information from Git and GitLab environment variables."""
    try:
        commit_hash = subprocess.check_output(["git", "rev-parse", "HEAD"]).decode().strip()

        branch = os.getenv("CI_COMMIT_REF_NAME", None)
        if branch is None:  
            branch = subprocess.check_output(["git", "rev-parse", "--abbrev-ref", "HEAD"]).decode().strip()
        
        repository_path = subprocess.check_output(["git", "rev-parse", "--show-toplevel"]).decode().strip()
        repository = os.path.basename(repository_path)
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to fetch Git information: {e}")
        return None

    return {
        "commitHash": commit_hash,
        "branch": branch,
        "repository": repository
    }


def get_gitlab_metadata():
    """Fetch GitLab metadata using environment variables."""
    git_info = get_git_info()
    if not git_info:
        return None

    metadata = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "repository": git_info["repository"],
        "branch": git_info["branch"],
        "commitHash": git_info["commitHash"],
        "runner": os.getenv("CI_RUNNER_DESCRIPTION", os.getenv("CI_RUNNER_ID", "unknown")),  
        "projectId": os.getenv("CI_PROJECT_ID", "unknown")
    }
    return metadata


def save_metadata_to_json():
    """Save metadata as a JSON file in the /data directory."""
    metadata = get_gitlab_metadata()
    if not metadata:
        print("❌ Failed to fetch metadata")
        return

    #save data/metadata.json
    data_dir = os.path.join(os.getenv("CI_PROJECT_DIR", "."), "data")
    os.makedirs(data_dir, exist_ok=True)

    output_path = os.path.join(data_dir, "metadata.json")

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)

    print(f"✅ Metadata saved to {output_path}")

if __name__ == "__main__":
    save_metadata_to_json()
