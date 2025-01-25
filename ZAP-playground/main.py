import time
from zapv2 import ZAPv2
from config import config

zap = ZAPv2(apikey=config.zap_api)

target = "http://localhost:3000"

# Proxy a request to the target so that ZAP has something to deal with
print('Accessing target {}'.format(target))
zap.urlopen(target)
# Give the sites tree a chance to get updated
time.sleep(1)

# spidering
print('Spidering target {}'.format(target))
scanid = zap.spider.scan(target)
start_time = time.time()  # Record the start time
max_duration = 30
# Give the Spider a chance to start
time.sleep(2)
while (int(zap.spider.status(scanid)) < 90):
    elapsed_time = time.time() - start_time
    if elapsed_time > max_duration:
        print("Time limit reached. Stopping the spider scan.")
        zap.spider.stop(scanid)  # Force stop the spider
        break
    # Loop until the spider has finished
    print('Spider progress %: {}'.format(zap.spider.status(scanid)))
    time.sleep(2)

# print ('Spider completed')

# while (int(zap.pscan.records_to_scan) > 0):
#       print ('Records to passive scan : {}'.format(zap.pscan.records_to_scan))
#       time.sleep(2)

# print ('Passive Scan completed')

# print ('Active Scanning target {}'.format(target))
# scanid = zap.ascan.scan(target)
# while (int(zap.ascan.status(scanid)) < 100):
#     # Loop until the scanner has finished
#     print ('Scan progress %: {}'.format(zap.ascan.status(scanid)))
#     time.sleep(5)

# print ('Active Scan completed')

# Report the results

# Fetch alerts and create a filtered report
print('Hosts:', ', '.join(zap.core.hosts))

# Fetch all alerts for the target
alerts = zap.core.alerts(baseurl=target, start=0, count=30)

# Filter for "High" severity issues
high_severity_alerts = [alert for alert in alerts if alert['risk'] == 'Medium']

# Filter alerts by risk level and get top 3 issues for each level
def print_alerts_by_risk_level(risk_level, limit=3):
    filtered_alerts = [alert for alert in alerts if alert['risk'] == risk_level]
    if filtered_alerts:
        print(f"\nTop {limit} {risk_level} issues:")
        for idx, alert in enumerate(filtered_alerts[:limit], start=1):
            print(f"\nIssue #{idx}")
            print(f"  Alert: {alert['alert']}")
            print(f"  Risk: {alert['risk']}")
            print(f"  URL: {alert['url']}")
            print(f"  Description: {alert['description']}")
    else:
        print(f"No {risk_level.lower()} issues detected!")

# Report for each risk level (Low, Medium, High)
print_alerts_by_risk_level('High')
print_alerts_by_risk_level('Medium')
print_alerts_by_risk_level('Low')


# stop the spider just in case
zap.spider.stop(scanid)
