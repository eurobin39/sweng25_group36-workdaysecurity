#!/usr/bin/env python3
import re
import json
import sys

# Keys corresponding to the five comma-separated values.
CSV_KEYS = ["test result", "risk", "confidence", "alert", "description"]

def extract_csv_entries(text):
    """
    Search the given text for comma separated entries that look like:
      Pass, NA, NA, SQL login injection, Attempted SQL injection with password and did not succeed
    or
      Fail, High, High, SQL login injection, Attempted SQL injection with password and succeeded.
    
    Returns a list of dictionaries mapping CSV_KEYS to the corresponding values.
    """
    
    pattern = re.compile(
        r'(Pass|Fail)\s*,\s*'   # test result
        r'([^,]+)\s*,\s*'       # risk
        r'([^,]+)\s*,\s*'       # confidence
        r'([^,]+)\s*,\s*'       # alert
        r'(.*?)(?=$|\n)'        # description (up to end of line)
    )

    entries = []
    # re.findall will return a list of tuples of all the capture groups.
    for match in pattern.findall(text):
        # Remove any extra whitespace from each field.
        fields = [field.strip() for field in match]
        entry = dict(zip(CSV_KEYS, fields))
        entries.append(entry)
    return entries

def main(filename):
    # Read the entire file
    with open(filename, 'r') as f:
        content = f.read()

    # Extract CSV entries from the file content
    entries = extract_csv_entries(content)

    # Output the list of JSON objects (dictionaries)
    print(json.dumps(entries, indent=4))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_csv.py <filename>")
        sys.exit(1)
    main(sys.argv[1])
