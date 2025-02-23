from typing import Any, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_active_user
from app.models.users import User
from app.models.facilities import Facility
from app.schemas.facilities import FacilityCreate, FacilityRead, FacilityUpdate, FacilitySettings

router = APIRouter()

@router.get("/{facility_id}/settings", response_model=FacilityRead)
def get_facility_settings(
    facility_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Get facility settings.
    """
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility

@router.put("/{facility_id}/settings", response_model=FacilityRead)
def update_facility_settings(
    facility_id: UUID,
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    settings_in: FacilityUpdate,
) -> Any:
    """
    Update facility settings.
    """
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    for field, value in settings_in.model_dump(exclude_unset=True).items():
        setattr(facility, field, value)
    
    db.commit()
    return facility

@router.post("/", response_model=FacilityRead)
def create_facility(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    facility_in: FacilityCreate
) -> Any:
    """
    Create new facility.
    """
    if current_user.role != "staff":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    facility = Facility(
        name=facility_in.name,
        settings=facility_in.settings
    )
    db.add(facility)
    db.commit()
    db.refresh(facility)
    return facility

@router.get("/", response_model=List[FacilityRead])
def list_facilities(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    List facilities.
    """
    if current_user.role != "staff":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    facilities = db.query(Facility).all()
    return facilities

@router.get("/{facility_id}", response_model=FacilityRead)
def get_facility(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    facility_id: UUID
) -> Any:
    """
    Get facility by ID.
    """
    if current_user.role != "staff":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility

@router.put("/{facility_id}/settings", response_model=FacilityRead)
def update_facility_settings(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    facility_id: UUID,
    settings: FacilitySettings
) -> Any:
    """
    Update facility settings.
    """
    if current_user.role != "staff":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    # Update only configurable settings
    facility.settings.update(settings.dict(exclude_unset=True))
    db.add(facility)
    db.commit()
    db.refresh(facility)
    return facility

@router.delete("/{facility_id}")
def delete_facility(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    facility_id: UUID
) -> Any:
    """
    Delete facility.
    """
    if current_user.role != "staff":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    facility = db.query(Facility).filter(Facility.id == facility_id).first()
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    db.delete(facility)
    db.commit()
    return {"msg": "Facility deleted"}
