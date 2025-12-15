#!/usr/bin/env python3
"""
Run script to start the FastAPI backend server.
This script can be run from within the backend folder.

Usage:
    python run.py
    # or
    python -m uvicorn backend.main:app --reload
"""
import sys
import subprocess
from pathlib import Path

# Add the parent directory to the Python path so backend package imports work
backend_dir = Path(__file__).parent.absolute()
parent_dir = backend_dir.parent
if str(parent_dir) not in sys.path:
    sys.path.insert(0, str(parent_dir))

# Check if uvicorn is available
try:
    import uvicorn
except ImportError:
    print("Error: uvicorn is not installed.")
    print("\nPlease install dependencies first:")
    print("  pip install -r requirements.txt")
    print("\nOr if using a virtual environment:")
    print("  python -m venv venv")
    print("  .\\venv\\Scripts\\activate  # On Windows")
    print("  pip install -r requirements.txt")
    sys.exit(1)

# Now run uvicorn
if __name__ == "__main__":
    # Use uvicorn.run which is more reliable than subprocess
    # Use 127.0.0.1 (localhost) instead of 0.0.0.0 for browser access
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)

