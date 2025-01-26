from zap_scanner import ZapScanner

import os

from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("ZAP_API_KEY")


if __name__ == "__main__":

    if not api_key:
        raise ValueError("API Key not found. Set ZAP_API_KEY in the .env file.")

    # 스캔할 대상 URL 설정
    target_url = os.getenv("target_url")
    print(target_url)

    # ZapScanner 초기화
    print("zap_scanner is running")
    zap_scanner = ZapScanner(api_key=api_key)

    # 스캔 실행
    alerts = zap_scanner.start_scan(target_url)

    # 결과 출력
    print("\nScan Results:")
    if alerts:
        for alert in alerts:
            print(f"- {alert['alert']}: {alert['risk']} at {alert['url']}")
    else:
        print("No vulnerabilities found.")
