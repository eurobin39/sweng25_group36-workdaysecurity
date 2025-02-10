from zap_scanner import ZapScanner
import os
import json
from dotenv import load_dotenv


load_dotenv()


api_key = os.getenv("ZAP_API_KEY")

if __name__ == "__main__":
    if not api_key:
        raise ValueError("API Key not found. Set ZAP_API_KEY in the .env file.")

    
    target_url = os.getenv("TARGET_URL")  
    
    if not target_url:
        raise ValueError("Target URL not found. Set TARGET_URL in the .env file.")

    print(f"Scanning target: {target_url}")

    
    print("ZAP Scanner is running...")
    zap_scanner = ZapScanner(api_key=api_key)

    
    alerts = zap_scanner.start_scan(target_url)
    print("Raw Scan Results:", alerts)  


    
    json_file_path = "zap_results.json"
    with open(json_file_path, "w", encoding="utf-8") as json_file:
        json.dump(alerts, json_file, indent=4, ensure_ascii=False)

    print(f"\nScan Results saved to {json_file_path}")

    
    print("\nScan Summary:")
    if alerts:
        for alert in alerts:
            print(f"- {alert['alert']}: {alert['risk']} at {alert['url']}")
    else:
        print("No vulnerabilities found.")