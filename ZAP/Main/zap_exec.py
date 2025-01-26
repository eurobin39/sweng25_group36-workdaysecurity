import subprocess
import time
from zapv2 import ZAPv2
import os

from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("ZAP_API_KEY")

# ZAP path
zap_path = "/Applications/ZAP.app/Contents/MacOS/zap.sh"

# ZAP Daemon 
subprocess.Popen([zap_path, "-daemon", "-host", "127.0.0.1", "-port", "8080"])

time.sleep(10)  # wait 10secs

# ZAP API connect
zap = ZAPv2(apikey=api_key, proxies={'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'})

try:
    print(f"Connected to ZAP API. Version: {zap.core.version}") # check connection
except Exception as e:
    print(f"Failed to connect to ZAP API: {e}")
