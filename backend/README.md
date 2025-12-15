# Backend

FastAPI backend for InnovationCharacter.

## Running from the Backend Folder

You can now run the backend directly from within this folder:

```bash
# From inside the backend/ folder
python run.py
```

This will start the server at `http://127.0.0.1:8000` (or `http://localhost:8000`) with auto-reload enabled.

## Running from the Root Directory

You can also run it from the project root (as before):

```bash
# From the project root
uvicorn backend.main:app --reload
```

## Environment Variables

The application will look for a `.env` file in the following locations (in order):
1. `backend/.env` (backend folder)
2. `.env` (project root)
3. `.env` (current directory)

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `CORS_ORIGINS`: Comma-separated list of allowed CORS origins (optional, defaults to `http://localhost:5173,http://localhost:5137`)

## Health Check

Once running, verify the server is working:
```
http://127.0.0.1:8000/healthz
```

## API Documentation

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

