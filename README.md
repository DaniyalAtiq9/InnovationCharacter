# InnovationCharacter

Welcome to **InnovationCharacter**! This is a backend service built with **FastAPI** and **MongoDB Atlas**, designed to provide a robust and scalable API for managing your application's data. The service interacts with a **MongoDB** database to store and retrieve information efficiently.

## Features

* Fast and asynchronous API built with **FastAPI**
* MongoDB database integration using **Motor** (asynchronous MongoDB driver)
* JWT authentication with **PyJWT** for secure access
* SSL support for MongoDB Atlas connection
* Endpoint health check for monitoring the status of the service and database connection

## Installation

Follow these steps to set up and run the application locally.

### Prerequisites

* Python 3.8 or higher
* MongoDB Atlas account (for remote MongoDB)
* Dependencies are listed in `requirements.txt`

### 1. Clone the Repository

```bash
git clone https://github.com/DaniyalAtiq9/InnovationCharacter.git
cd InnovationCharacter
```

### 2. Install Dependencies

Create a virtual environment and install the required dependencies:

```bash
python -m venv .env
source .env/bin/activate  # For Linux/macOS
.env\Scripts\activate  # For Windows

pip install -r requirements.txt
```

### 3. Set Environment Variables

You will need to set the following environment variables for the app to connect to MongoDB:

* `MONGODB_URI`: The connection string for your MongoDB Atlas database.

You can add these variables directly to the environment or use a `.env` file to store them. Example:

```bash
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority"
```

Replace `<username>`, `<password>`, and `mydatabase` with your actual MongoDB credentials and database name.

### 4. Run the Application

Once the environment is set up, you can start the development server with **Uvicorn**:

```bash
uvicorn backend.main:app --reload
```

This will start the FastAPI server locally at `http://127.0.0.1:8000`.

### 5. Verify the Health Endpoint

You can check the health of the backend and database by visiting:

```
http://127.0.0.1:8000/healthz
```

The response should be:

```json
{"status": "ok", "db": "connected"}
```

## Endpoints

### 1. `/healthz` - Health Check Endpoint

This endpoint returns the status of the API and the database connection.

* **GET** `/healthz`
* Response:

```json
{
  "status": "ok",
  "db": "connected"
}
```

### 2. `/docs` - Swagger UI Documentation

You can access the **Swagger UI** to interact with and test all available API endpoints by visiting:

```
http://127.0.0.1:8000/docs
```

### 3. `/redoc` - Alternative API Documentation

Alternatively, you can use **Redoc** for API documentation:

```
http://127.0.0.1:8000/redoc
```

## Deployment

This project is deployed on **Render** for automatic deployment from GitHub.

### Steps for Deployment:

1. **Push to GitHub**: Make sure your repository is up-to-date with the latest changes.
2. **Render Configuration**: Connect your GitHub repository to Render.
3. **Deploy**: Render will automatically detect changes in your repository and deploy the latest version.
