import requests
import uuid
import json

BASE_URL = "http://localhost:8000/api/v1"
AUTH_URL = f"{BASE_URL}/auth"

def run_test():
    print("Starting Dashboard API Test...")

    # 1. Create a unique user for testing
    unique_id = str(uuid.uuid4())[:8]
    email = f"test_dash_{unique_id}@example.com"
    password = "testpassword123"
    name = f"Test User {unique_id}"

    print(f"\n1. Registering user: {email}")
    signup_payload = {
        "email": email,
        "password": password,
        "name": name
    }
    
    response = requests.post(f"{AUTH_URL}/signup", json=signup_payload)
    if response.status_code != 200:
        print(f"Signup failed: {response.text}")
        return

    auth_data = response.json()
    token = auth_data["token"]
    print("User authenticated successfully.")
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Dashboard Stats (should be default since no assessment)
    print("\n2. Fetching Dashboard Stats (Default)...")
    response = requests.get(f"{BASE_URL}/dashboard/stats", headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch dashboard stats: {response.text}")
        return

    stats = response.json()
    print("Stats retrieved successfully.")
    print(f"Current Scores count: {len(stats['currentScores'])}")
    print(f"History entries: {len(stats['history'])}")
    
    if len(stats['currentScores']) == 6:
        print("✅ Default scores present.")
    else:
        print(f"❌ unexpected score count: {len(stats['currentScores'])}")

    # 3. Log a few moments to test Reflection
    print("\n3. Logging Moments for Reflection...")
    virtues = ["wisdom", "courage", "justice"]
    for v in virtues:
        moment_payload = {
            "content": f"Practiced {v} today.",
            "virtue_id": v
        }
        requests.post(f"{BASE_URL}/moments", json=moment_payload, headers=headers)
    print("Moments logged.")

    # 4. Get Weekly Reflection
    print("\n4. Fetching Weekly Reflection...")
    response = requests.get(f"{BASE_URL}/reflection/weekly", headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch reflection: {response.text}")
        return

    reflection = response.json()
    print("Reflection retrieved successfully.")
    print(f"Summary: {reflection['summary']}")
    print(f"Insights count: {len(reflection['insights'])}")
    
    if len(reflection['insights']) > 0:
        print("✅ Insights present.")
    else:
        print("❌ No insights found.")
        
    print(f"\nResponse JSON:\n{json.dumps(reflection, indent=2)}")

    print("\nTest Complete.")

if __name__ == "__main__":
    run_test()