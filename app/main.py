from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import auth, registration, contacts, facilities, calls
from app.database import Base, engine

app = FastAPI(title="OpenConnect API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(registration.router, prefix="/api", tags=["registration"])
app.include_router(contacts.router, prefix="/api/contacts", tags=["contacts"])
app.include_router(facilities.router, prefix="/api/facilities", tags=["facilities"])
app.include_router(calls.router, prefix="/api/calls", tags=["calls"])

# Create database tables
Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {"message": "Welcome to OpenConnect API"}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc)},
    )
