import os
import sys
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

def get_maintainer():
    """Retrieve the identity and email of the maintainer.
    
    It first checks for the 'GITLAB_USER_NAME' and 'GITLAB_USER_EMAIL' environment variables.
    If they are not available, it falls back to using the author name and email of the latest Git commit.
    """
    maintainer_name = os.getenv("GITLAB_USER_NAME")
    maintainer_email = os.getenv("GITLAB_USER_EMAIL")

    if not maintainer_name or not maintainer_email:
        try:
            maintainer_name = subprocess.check_output(
                ["git", "log", "-1", "--pretty=format:%an"]
            ).decode().strip()
            maintainer_email = subprocess.check_output(
                ["git", "log", "-1", "--pretty=format:%ae"]
            ).decode().strip()
        except subprocess.CalledProcessError as e:
            print(f"❌ Failed to fetch maintainer information: {e}")
            maintainer_name, maintainer_email = "unknown", "unknown"
    
    return {
        "uploader_name": maintainer_name,
        "uploader_email": maintainer_email
    }

def get_gitlab_metadata():
    """Fetch GitLab metadata using environment variables."""
    git_info = get_git_info()
    if not git_info:
        return None

    maintainer = get_maintainer()

    metadata = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "repository": git_info["repository"],
        "branch": git_info["branch"],
        "commitHash": git_info["commitHash"],
        "runner": os.getenv("CI_RUNNER_DESCRIPTION", os.getenv("CI_RUNNER_ID", "unknown")),
        "projectId": os.getenv("CI_PROJECT_ID", "unknown"),
        "maintainer": maintainer
    }
    return metadata

def save_metadata_to_json():
    """Save metadata as a JSON file in the /artifacts directory."""
    metadata = get_gitlab_metadata()
    if not metadata:
        print("❌ Failed to fetch metadata")
        return

    # Save to the file path provided as the first command-line argument.
    metadata_relative_path = sys.argv[1]

    with open(metadata_relative_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=4)

    print(f"✅ Metadata saved to {metadata_relative_path}")

if __name__ == "__main__":
    save_metadata_to_json()
