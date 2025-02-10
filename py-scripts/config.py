from dataclasses import dataclass
import os
from dotenv import load_dotenv

# file responsible for safe use of secrets (API keys and so on)

@dataclass
class Config:
    zap_path: str
    zap_host: str
    zap_port: str
    zap_api: str
    db_name: str
    db_user: str
    db_password: str
    db_host: str
    db_port: str


def get_config():
    load_dotenv()

    path = "/System/Volumes/Data/Applications/ZAP.app/Contents/Java/zap.sh"  # adjust this to your ZAP launch script
    host = "localhost"
    port = "8080"
    token = os.getenv("ZAP_API_KEY", " ")
    if not token:
        raise ValueError("ZAP_API_KEY environment variable is missing!")

    return Config(
        zap_path=path,
        zap_host=host,
        zap_port=port,
        zap_api=token,
        db_name=os.getenv("DB_NAME"),
        db_user=os.getenv("DB_USER"),
        db_password=os.getenv("DB_PASSWORD"),
        db_host=os.getenv("DB_HOST"),
        db_port=os.getenv("DB_PORT")
    )

# Load the configuration
config = get_config()
