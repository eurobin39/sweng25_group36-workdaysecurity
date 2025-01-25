from dataclasses import dataclass
import os
from dotenv import load_dotenv

# file responsible for safe use of secrets (API keys and so on)

@dataclass
class Config:
    zap_api: str

def get_config():
    load_dotenv()

    token = os.getenv("ZAP_API_KEY", "")
    if not token:
        raise ValueError("ZAP_API_KEY environment variable is missing!")

    return Config(zap_api=token)

# Load the configuration
config = get_config()
