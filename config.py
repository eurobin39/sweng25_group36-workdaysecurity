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


def get_config():
    load_dotenv()

    path = "/System/Volumes/Data/Applications/ZAP.app/Contents/Java/zap.sh"  # adjust this to your ZAP launch script
    host = "localhost"
    port = "8080"
    token = os.getenv("ZAP_API_KEY", " ")
    if not token:
        raise ValueError("ZAP_API_KEY environment variable is missing!")

    return Config(
                zap_path = path,
                zap_host = host,
                zap_port = port,
                zap_api  = zap_token
        )

# Load the configuration
config = get_config()
