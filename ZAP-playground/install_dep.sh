#!/bin/bash

# Exit on error
set -e

# Check if requirements.txt exists
if [ ! -f requirements.txt ]; then
  echo "Error: requirements.txt not found!"
  exit 1
fi

# Create a virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
  echo "Creating virtual environment..."
  python3 -m venv .venv
else
  echo "Virtual environment already exists."
fi

# Activate the virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install the dependencies from requirements.txt
echo "Installing dependencies from requirements.txt..."
pip install -r requirements.txt

# Success message
echo "Setup complete! Virtual environment is ready and dependencies installed."
echo "If you use mac, type source .venv/bin/activate to activate a virtual environment"

# deactivate venv
deactivate
