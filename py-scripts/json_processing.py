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
    # The regex explained:
    #   (Pass|Fail)           -> Capture group 1: either "Pass" or "Fail" (the test result)
    #   \s*,\s*               -> A comma with optional whitespace around it.
    #   ([^,]+)               -> Capture group 2: one or more characters that are not a comma (risk)
    #   \s*,\s*               -> comma separator (and so on)
    #   ([^,]+)               -> Capture group 3: confidence
    #   \s*,\s*
    #   ([^,]+)               -> Capture group 4: alert
    #   \s*,\s*
    #   (.*?)(?=$|\n)         -> Capture group 5: description (non-greedy until end of line)
    #
    # This regex assumes that the first four fields do not contain commas.
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

def main(input_filename, output_filename):
    # Read the entire file
    with open(input_filename, 'r') as f:
        content = f.read()

    # Extract CSV entries from the file content
    entries = extract_csv_entries(content)

    # Write the JSON output to the specified output file
    json_output = json.dumps(entries, indent=4)

    # Output the JSON to the console
    print(json_output)

    # Save the JSON string to a file
    with open(output_filename, 'w') as outfile:
        outfile.write(json_output)
    print(f"JSON output saved to {output_filename}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_csv.py <input_filename> [output_filename]")
        sys.exit(1)
    input_filename = sys.argv[1]
    output_filename = sys.argv[2] if len(sys.argv) > 2 else "output.json"
    main(input_filename, output_filename)
