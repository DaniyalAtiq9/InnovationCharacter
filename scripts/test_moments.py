import requests
import time
import uuid

BASE_URL = "http://localhost:8000/api/v1"
AUTH_URL = f"{BASE_URL}/auth"

def run_test():
    print("Starting Moments API Test...")

    # 1. Create a unique user for testing
    unique_id = str(uuid.uuid4())[:8]
    email = f"test_moment_{unique_id}@example.com"
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
        # Try login if user already exists (though unlikely with uuid)
        print("Trying login instead...")
        data = {
            "username": email,
            "password": password
        }
        response = requests.post(f"{AUTH_URL}/login", data=data)
        if response.status_code != 200:
            print(f"Login failed: {response.text}")
            return

    auth_data = response.json()
    token = auth_data["token"]
    print("User authenticated successfully.")
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Log a Moment
    print("\n2. Logging a Character Moment...")
    moment_payload = {
        "content": "I helped a colleague debug their code today.",
        "virtue_id": "kindness"
    }
    
    response = requests.post(f"{BASE_URL}/moments", json=moment_payload, headers=headers)
    if response.status_code != 200:
        print(f"Failed to log moment: {response.text}")
        return

    moment_data = response.json()
    print("Moment logged successfully.")
    print(f"Response: {moment_data}")
    
    # Verify feedback
    expected_feedback = "A small act of kindness goes a long way. Beautiful!"
    if moment_data.get("feedback") == expected_feedback:
        print("✅ Feedback verified successfully.")
    else:
        print(f"❌ Feedback mismatch. Expected '{expected_feedback}', got '{moment_data.get('feedback')}'")

    # 3. Get Moments History
    print("\n3. Fetching Moments History...")
    response = requests.get(f"{BASE_URL}/moments", headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch history: {response.text}")
        return

    history = response.json()
    print(f"Retrieved {len(history)} moments.")
    
    # Verify the logged moment is in history
    found = False
    moment_id = moment_data.get("id") or moment_data.get("_id")
    
    for m in history:
        hist_id = m.get("id") or m.get("_id")
        if hist_id == moment_id:
            found = True
            print("✅ Created moment found in history.")
            break
    
    if not found:
        print("❌ Created moment NOT found in history.")

    print("\nTest Complete.")

if __name__ == "__main__":
    run_test()