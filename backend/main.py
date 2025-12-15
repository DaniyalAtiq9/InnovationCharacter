from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .database import client
from pymongo.errors import ConnectionFailure
from .routers import auth, onboarding, moments, dashboard, external

app = FastAPI()

app.include_router(auth.router, prefix="/api/v1/auth")
app.include_router(onboarding.router, prefix="/api/v1")
app.include_router(moments.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(external.router, prefix="/api/v1")

origins = [
    "http://localhost:5173",
    "http://localhost:5137",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
async def health_check():
    try:
        # Check database connection using the ping command
        await client.admin.command('ping')
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        # Log the error in a real app
        print(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Database not ready")