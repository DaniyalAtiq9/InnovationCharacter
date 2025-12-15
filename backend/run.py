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
import os
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
    # Detect if we're running on Render (has PORT environment variable)
    port = int(os.environ.get("PORT", 8000))
    is_render = "PORT" in os.environ
    
    if is_render:
        # On Render, bind to 0.0.0.0 and use PORT, no reload in production
        uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)
    else:
        # Local development: use 127.0.0.1 for browser access, with reload
        uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)

