from zapv2 import ZAPv2
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("ZAP_API_KEY")

class ZapScanner:
    def __init__(self, api_key, base_url="http://localhost:8080"):
        self.zap = ZAPv2(apikey=api_key, proxies={"http": base_url, "https": base_url})

    def start_scan(self, target_url):
        print(f"Starting scan for {target_url}")
        self.zap.urlopen(target_url)  # access to URL
        scan_id = self.zap.ascan.scan(target_url)  # start Active Scan
        while int(self.zap.ascan.status(scan_id)) < 100:
            print(f"Scan progress: {self.zap.ascan.status(scan_id)}%")
        print("Scan completed!")
        return self.zap.core.alerts(target_url)
