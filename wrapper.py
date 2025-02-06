#!/usr/bin/env python3
import time
import os
import subprocess
from zapv2 import ZAPv2

# --- Configuration ---
ZAP_PATH = "/System/Volumes/Data/Applications/ZAP.app/Contents/Java/zap.sh"  # adjust this to your ZAP launch script
ZAP_API_KEY = ""  # if you have an API key configured; else leave empty
ZAP_HOST = "localhost"
ZAP_PORT = "8080"

# The script details provided by the user
SCRIPT_NAME = "sql_injection_login"
SCRIPT_TYPE = "zest"       # or 'standalone', etc.
SCRIPT_ENGINE = "zest"     # for Zest, this is typically 'zest'
SCRIPT_FILE = "/Users/timothytay/Desktop/sweng2025/sweng25_group36-workdaysecurity/zest-scrips/sql_injection_login.zst"

# --- Start ZAP in daemon mode (if necessary) ---
def start_zap():
    print("Starting ZAP in daemon mode...", flush=True)
    zap_cmd = [ZAP_PATH, "-daemon", "-config", "api.disablekey=true", "-config", "log.level=DEBUG"]
    process = subprocess.Popen(zap_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    print("ZAP process started with PID:", process.pid, flush=True)
    time.sleep(20)  # Ensure ZAP has time to boot up
    print("ZAP should be running now.", flush=True)

def load_and_run_script(zap):
    print("Loading script...", flush=True)
    try:
        response = zap.script.load(scriptName=SCRIPT_NAME,
                                   scriptType=SCRIPT_TYPE,
                                   scriptEngine=SCRIPT_ENGINE,
                                   fileName=SCRIPT_FILE)
        print("Load response:", response, flush=True)
    except Exception as e:
        print("Error loading script:", e, flush=True)
    
    print("Running script...", flush=True)
    try:
        response = zap.script.run(scriptName=SCRIPT_NAME)
        print("Run response:", response, flush=True)
    except Exception as e:
        print("Error running script:", e, flush=True)
    
    print("Removing script...", flush=True)
    try:
        response = zap.script.remove(scriptName=SCRIPT_NAME)
        print("Remove response:", response, flush=True)
    except Exception as e:
        print("Error removing script:", e, flush=True)

# --- Main entry point ---
def main():
    # Optionally, start ZAP if it isn't already running.
    # If you expect users to run ZAP separately, you can comment out the next line.
    start_zap()

    # Create a ZAP API client instance
    zap = ZAPv2(apikey=ZAP_API_KEY, proxies={'http': f'http://{ZAP_HOST}:{ZAP_PORT}', 'https': f'http://{ZAP_HOST}:{ZAP_PORT}'})
    
    # Give a little extra time for the API to be ready
    time.sleep(5)
    
    # Load and run the user's script
    load_and_run_script(zap)
    
    # Optionally, retrieve some logs or results
    # For example, to get alerts (vulnerabilities) found during scanning:
    alerts = zap.core.alerts(baseurl="http://example.com")
    print("Alerts found:")
    for alert in alerts:
        print(alert)

if __name__ == "__main__":
    main()
