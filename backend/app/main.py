from fastapi import FastAPI
from app.routers import auth, registration, contacts, facilities, calls

app = FastAPI()

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(registration.router, prefix="/api/registration", tags=["registration"])
app.include_router(contacts.router, prefix="/api/contacts", tags=["contacts"])
app.include_router(facilities.router, prefix="/api/facilities", tags=["facilities"])
app.include_router(calls.router, prefix="/api/calls", tags=["calls"])
