import requests
import uuid
import json

BASE_URL = "http://localhost:8000/api/v1"
AUTH_URL = f"{BASE_URL}/auth"

def run_test():
    print("Starting External API Test (Challenges & News)...")

    # 1. Create a unique user for testing
    unique_id = str(uuid.uuid4())[:8]
    email = f"test_ext_{unique_id}@example.com"
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

    # 2. Set user goals (Priority Virtues)
    print("\n2. Setting User Goals (Priority Virtues)...")
    goals_payload = {
        "priority_virtues": ["courage", "empathy"],
        "innovation_goal": "To be a better leader"
    }
    response = requests.post(f"{BASE_URL}/goals", json=goals_payload, headers=headers)
    if response.status_code != 200:
        print(f"Failed to set goals: {response.text}")
        return
    print("Goals set successfully.")

    # 3. Fetch Challenges (Should generate new ones)
    print("\n3. Fetching Challenges (First time - Generation)...")
    response = requests.get(f"{BASE_URL}/challenges", headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch challenges: {response.text}")
        return
    
    challenges = response.json()
    print(f"Challenges retrieved: {len(challenges)}")
    
    if len(challenges) > 0:
        print("✅ Challenges generated.")
        print(f"First challenge: {challenges[0]['title']} ({challenges[0]['status']})")
    else:
        print("❌ No challenges generated.")
        return

    # 4. Toggle Challenge Status
    challenge_to_update = challenges[0]
    challenge_id = challenge_to_update["_id"]
    print(f"\n4. Updating Challenge {challenge_id} status to 'completed'...")
    
    update_payload = {"status": "completed"}
    response = requests.patch(f"{BASE_URL}/challenges/{challenge_id}", json=update_payload, headers=headers)
    if response.status_code != 200:
        print(f"Failed to update challenge: {response.text}")
        return
    
    updated_challenge = response.json()
    print(f"Updated status: {updated_challenge['status']}")
    
    if updated_challenge['status'] == 'completed':
        print("✅ Status updated successfully.")
    else:
        print(f"❌ Status mismatch: {updated_challenge['status']}")

    # 5. Fetch Challenges again (Verify persistence)
    print("\n5. Fetching Challenges again (Verify Persistence)...")
    response = requests.get(f"{BASE_URL}/challenges", headers=headers)
    challenges_v2 = response.json()
    
    # Find the updated challenge
    found_updated = next((c for c in challenges_v2 if c["_id"] == challenge_id), None)
    if found_updated and found_updated["status"] == "completed":
        print("✅ Persistence verified.")
    else:
        print("❌ Persistence check failed.")

    # 6. Fetch News (All)
    print("\n6. Fetching News (All)...")
    response = requests.get(f"{BASE_URL}/news", headers=headers)
    if response.status_code != 200:
        print(f"Failed to fetch news: {response.text}")
        return
    news = response.json()
    print(f"News articles retrieved: {len(news)}")
    if len(news) > 0:
        print("✅ News retrieved.")

    # 7. Fetch News (Filtered)
    print("\n7. Fetching News (Filtered by 'resilience')...")
    response = requests.get(f"{BASE_URL}/news?q=resilience", headers=headers)
    filtered_news = response.json()
    print(f"Filtered articles retrieved: {len(filtered_news)}")
    
    if len(filtered_news) > 0 and all("resilience" in a["title"].lower() or "resilience" in a["description"].lower() for a in filtered_news):
        print("✅ Filtering verified.")
    else:
        print("❌ Filtering failed or no matches found.")

    print("\nTest Complete.")

if __name__ == "__main__":
    run_test()