from typing import Any
from uuid import uuid4
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_db
from app.core.email import generate_verification_token, verify_token
from app.core.security import get_password_hash
from app.models.users import User
from app.models.contacts import Contact
from app.schemas.registration import (
    RegistrationStart,
    RegistrationResponse,
    EmailVerification,
    PersonalInfo,
    IdentityVerification,
    RelationshipInfo
)

router = APIRouter()

@router.post("/registration/start", response_model=RegistrationResponse)
def start_registration(
    registration: RegistrationStart,
    db: Session = Depends(get_db)
) -> Any:
    """
    Start registration process.
    """
    # Check if email exists and is not in pending state
    user = db.query(User).filter(
        User.email == registration.email,
        User.status != "pending"
    ).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Check if there's a pending registration
    pending_user = db.query(User).filter(
        User.email == registration.email,
        User.status == "pending"
    ).first()
    
    if pending_user:
        # Update existing pending registration
        registration_id = pending_user.id
    else:
        # Generate new registration
        registration_id = uuid4()
        user = User(
            id=registration_id,
            email=registration.email,
            role=registration.userType,
            status="pending"
        )
        db.add(user)
    
    # Generate verification token
    token = generate_verification_token(registration.email)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=24)
    
    db.commit()
    
    return RegistrationResponse(
        registrationId=str(registration_id),
        verificationToken=token,
        expiresAt=expires_at.isoformat()
    )

@router.post("/registration/verify-email")
def verify_registration_email(
    verification: EmailVerification,
    db: Session = Depends(get_db)
) -> Any:
    """
    Verify email for registration.
    """
    # Get user by registration ID
    from uuid import UUID
    try:
        registration_id = UUID(verification.registrationId)
        user = db.query(User).filter(User.id == registration_id).first()
        if not user:
            raise HTTPException(
                status_code=404,
                detail="Registration not found"
            )
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid registration ID format"
        )
    
    # Verify token
    if not verify_token(user.email, verification.verificationToken):
        raise HTTPException(
            status_code=400,
            detail="Invalid verification token"
        )
    
    # Update user status
    user.status = "email_verified"
    db.add(user)
    db.commit()
    
    return {
        "verified": True,
        "nextStep": "personal_info"
    }

@router.post("/registration/personal-info")
def submit_personal_info(
    info: PersonalInfo,
    db: Session = Depends(get_db)
) -> Any:
    """
    Submit personal information.
    """
    # Validate and store personal info
    return {
        "success": True,
        "nextStep": "identity_verification"
    }

@router.post("/registration/verify-identity")
def verify_identity(
    verification: IdentityVerification,
    db: Session = Depends(get_db)
) -> Any:
    """
    Submit identity verification.
    """
    # Process identity verification
    return {
        "verificationId": "temp-id",
        "status": "pending",
        "estimatedWaitTime": 24  # hours
    }

@router.post("/registration/relationships")
def add_relationships(
    relationships: RelationshipInfo,
    db: Session = Depends(get_db)
) -> Any:
    """
    Add relationship information.
    """
    # Process relationships
    return {
        "success": True,
        "pendingApprovals": [
            {
                "relationshipId": "temp-id",
                "status": "pending",
                "estimatedWaitTime": 24
            }
        ]
    }
