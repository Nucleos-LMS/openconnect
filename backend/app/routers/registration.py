from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.email import generate_verification_token, verify_token
from app.models.users import User
from app.schemas.registration import (
    RegistrationStart,
    RegistrationVerifyEmail,
    RegistrationPersonalInfo,
    RegistrationVerifyIdentity,
    RegistrationRelationships
)

router = APIRouter()

@router.post("/start")
def registration_start(
    *,
    db: Session = Depends(get_db),
    registration_in: RegistrationStart
) -> Any:
    """Start registration process."""
    # Check if email exists
    if db.query(User).filter(User.email == registration_in.email).first():
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Generate verification token
    token = generate_verification_token(registration_in.email)
    
    return {
        "registrationId": "test_id",  # Mock ID for testing
        "verificationToken": token,
        "expiresAt": "2025-02-24T00:00:00Z"  # Mock expiry for testing
    }

@router.post("/verify-email")
def verify_email(
    *,
    db: Session = Depends(get_db),
    verification_in: RegistrationVerifyEmail
) -> Any:
    """Verify email address."""
    if not verify_token(verification_in.email, verification_in.token):
        raise HTTPException(
            status_code=400,
            detail="Invalid verification token"
        )
    return {"verified": True}

@router.post("/personal-info")
def personal_info(
    *,
    db: Session = Depends(get_db),
    personal_info_in: RegistrationPersonalInfo
) -> Any:
    """Submit personal information."""
    return {"status": "success"}

@router.post("/verify-identity")
def verify_identity(
    *,
    db: Session = Depends(get_db),
    identity_in: RegistrationVerifyIdentity
) -> Any:
    """Submit identity verification."""
    return {"status": "success"}

@router.post("/relationships")
def relationships(
    *,
    db: Session = Depends(get_db),
    relationships_in: RegistrationRelationships
) -> Any:
    """Submit relationship information."""
    return {"status": "success"}
