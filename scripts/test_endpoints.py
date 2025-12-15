import requests
import json

BASE_URL = "http://localhost:8000/api/v1"
AUTH_URL = "http://localhost:8000/api/v1/auth"

USER_EMAIL = "test@example.com"
USER_PASSWORD = "password123"

def print_result(name, response):
    status = "SUCCESS" if response.status_code in [200, 201] else "FAILED"
    print(f"[{status}] {name} ({response.status_code})")
    if status == "FAILED":
        print(f"Error: {response.text}")
    return response

def test_endpoints():
    print("Starting API Tests...\n")
    
    # 1. Login
    print("--- Authentication ---")
    login_data = {
        "username": USER_EMAIL,
        "password": USER_PASSWORD
    }
    response = requests.post(f"{AUTH_URL}/login", data=login_data)
    print_result("Login", response)
    
    if response.status_code != 200:
        print("Login failed, aborting tests.")
        return

    token = response.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Token obtained.\n")

    # 2. Onboarding - Assessment
    print("--- Onboarding: Assessment ---")
    assessment_data = {
        "answers": {
            "q1": 5, "q2": 4, "q3": 5, "q4": 3, "q5": 4,
            "q6": 5, "q7": 4, "q8": 3, "q9": 5, "q10": 4
        }
    }
    
    # Submit Assessment
    response = requests.post(f"{BASE_URL}/assessment", json=assessment_data, headers=headers)
    print_result("Submit Assessment", response)
    
    # Get Assessment
    response = requests.get(f"{BASE_URL}/assessment", headers=headers)
    print_result("Get Assessment", response)
    print("")

    # 3. Onboarding - Goals
    print("--- Onboarding: Goals ---")
    goals_data = {
        "priority_virtues": ["wisdom", "courage", "resilience"],
        "innovation_goal": "To learn a new framework"
    }
    
    # Submit Goals
    response = requests.post(f"{BASE_URL}/goals", json=goals_data, headers=headers)
    print_result("Submit Goals", response)
    
    # Get Goals
    response = requests.get(f"{BASE_URL}/goals", headers=headers)
    print_result("Get Goals", response)
    print("")

    # 4. Moments
    print("--- Moments ---")
    moment_data = {
        "content": "I learned something new today about testing APIs.",
        "virtue_id": "curiosity"
    }
    
    # Create Moment
    response = requests.post(f"{BASE_URL}/moments", json=moment_data, headers=headers)
    print_result("Create Moment", response)
    
    # Get Moments
    response = requests.get(f"{BASE_URL}/moments", headers=headers)
    print_result("Get Moments", response)
    if response.status_code == 200:
        moments = response.json()
        print(f"Found {len(moments)} moments")
    print("")

    # 5. Dashboard
    print("--- Dashboard ---")
    # Get Stats
    response = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
    print_result("Get Dashboard Stats", response)
    
    # Get Weekly Reflection
    response = requests.get(f"{BASE_URL}/reflection/weekly", headers=headers)
    print_result("Get Weekly Reflection", response)
    print("")

if __name__ == "__main__":
    try:
        test_endpoints()
    except Exception as e:
        print(f"An error occurred: {e}")