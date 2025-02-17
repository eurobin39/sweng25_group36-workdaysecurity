#!/usr/bin/env python3
import re
import json
import sys
import os

# Keys corresponding to the seven comma-separated assertion fields.
CSV_KEYS = ["name", "status", "expected", "actual", "risk", "confidence", "message"]

def extract_assertions(text):
    """
    Extracts assertion lines from the log file.
    Each assertion line is expected to be a single line with 7 comma-separated fields,
    and should not begin with any header keywords like "Found", "Available", "Using", "Time", or "Test".
    
    For example:
      SQL login injection, pass, No SQL Injection detected, No SQL Injection detected, NA, NA, Attempted SQL injection with password and did not succeed.
    
    Returns a list of dictionaries mapping CSV_KEYS to the extracted values.
    """
    # Negative lookahead to ignore lines that start with unwanted header keywords.
    pattern = re.compile(
        r'^(?!Found|Available|Using|Time|Test)'
        r'(?P<name>[^,]+)\s*,\s*'
        r'(?P<status>\w+)\s*,\s*'
        r'(?P<expected>[^,]+)\s*,\s*'
        r'(?P<actual>[^,]+)\s*,\s*'
        r'(?P<risk>[^,]+)\s*,\s*'
        r'(?P<confidence>[^,]+)\s*,\s*'
        r'(?P<message>.+?)(?:\.\s*$|\s*$)',
        re.MULTILINE
    )
    
    assertions = []
    for match in pattern.finditer(text):
        # Build a dictionary from the named groups.
        entry = {key: match.group(key).strip() for key in CSV_KEYS}
        assertions.append(entry)
    return assertions

def extract_duration(text):
    """
    Extracts the test duration (in seconds) from a line like:
      Time taken: 31 seconds
    Returns the integer duration, or 0 if not found.
    """
    duration_pattern = re.compile(r'Time taken:\s*(\d+)\s*seconds', re.IGNORECASE)
    matches = duration_pattern.findall(text)
    if matches:
        return int(matches[-1])
    return 0

def determine_overall_status(assertions):
    """
    Determines the overall test status. If any assertion's status is 'fail'
    (case-insensitive), returns "fail". Otherwise, returns "pass".
    """
    for assertion in assertions:
        if assertion.get("status", "").lower() == "fail":
            return "fail"
    return "pass"

def extract_test_info(text):
    """
    Extracts testInfo fields from the log file.
    Looks for lines like:
      Test Suite: Zest Security Tests
      Test Type: advanced
      Category: general
    
    Returns a dictionary with keys: name, type, category.
    Uses defaults if any are missing.
    """
    info = {}
    suite_match = re.search(r'Test Suite:\s*(.+)', text)
    info["name"] = suite_match.group(1).strip() if suite_match else "Zest Security Tests"
    
    type_match = re.search(r'Test Type:\s*(.+)', text)
    info["type"] = type_match.group(1).strip() if type_match else "advanced"
    
    category_match = re.search(r'Category:\s*(.+)', text)
    info["category"] = category_match.group(1).strip() if category_match else "general"
    
    return info

def load_metadata(metadata_filename):
    """Load metadata from metadata.json file."""
    if not os.path.exists(metadata_filename):
        print(f"⚠️ Warning: {metadata_filename} not found. Using default metadata.")
        return {
            "timestamp": "unknown",
            "repository": "unknown",
            "branch": "unknown",
            "commitHash": "unknown",
            "runner": "unknown",
            "projectId": "unknown"
        }

    with open(metadata_filename, 'r', encoding="utf-8") as f:
        return json.load(f)

def main(input_filename, output_filename, metadata_filename):
    # Read the test results from the input file
    with open(input_filename, 'r') as f:
        content = f.read()

    # Extract necessary data
    assertions = extract_assertions(content)
    duration = extract_duration(content)
    overall_status = determine_overall_status(assertions)
    vulnerability_found = overall_status == "fail"
    test_info = extract_test_info(content)
    
    # Load metadata from file
    metadata = load_metadata(metadata_filename)

    # Build the final JSON structure as a list
    results = [{
        "metadata": metadata,
        "testInfo": test_info,
        "results": {
            "status": overall_status,
            "duration": duration,
            "vulnerabilityFound": vulnerability_found,
            "assertions": assertions
        }
    }]

    # Save JSON output to file
    with open(output_filename, 'w', encoding="utf-8") as outfile:
        json.dump(results, outfile, indent=4)

    
    print(f"✅ JSON output saved to {output_filename}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python json_processing.py <input_filename> <output_filename> <metadata_filename>")
        sys.exit(1)
    
    input_filename = sys.argv[1]
    output_filename = sys.argv[2]
    metadata_filename = sys.argv[3] if len(sys.argv) > 3 else "metadata.json"

    main(input_filename, output_filename, metadata_filename) 
