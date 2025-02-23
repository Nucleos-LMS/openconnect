from typing import Any
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_active_user
from app.models.users import User
from app.models.facilities import Facility
from app.schemas.facilities import FacilityCreate, FacilityRead, FacilityUpdate

router = APIRouter()

@router.put("/{facility_id}/settings", response_model=FacilityRead)
def update_facility_settings(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    facility_id: UUID,
    facility_in: FacilityUpdate
) -> Any:
    """Update facility settings."""
    if current_user.role != "staff":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    # Update fields
    for field, value in facility_in.model_dump(exclude_unset=True).items():
        setattr(facility, field, value)
    
    db.add(facility)
    db.commit()
    db.refresh(facility)
    return facility

@router.get("/{facility_id}/settings", response_model=FacilityRead)
def get_facility_settings(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    facility_id: UUID
) -> Any:
    """Get facility settings."""
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility
