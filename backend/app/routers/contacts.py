from typing import Any, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_active_user
from app.models.users import User
from app.models.contacts import Contact
from app.schemas.contacts import ContactCreate, ContactRead, ContactUpdate

router = APIRouter()

@router.post("/request", response_model=ContactRead)
def request_contact(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    contact_in: ContactCreate
) -> Any:
    """Request a new contact."""
    contact = Contact(
        requestor_id=current_user.id,
        contact_id=contact_in.contact_id,
        relationship=contact_in.relationship,
        status="pending"
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

@router.put("/{contact_id}/approve", response_model=ContactRead)
def approve_contact(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    contact_id: UUID,
    contact_in: ContactUpdate
) -> Any:
    """Approve or reject a contact request."""
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Only the contact or staff can approve/reject
    if current_user.id != contact.contact_id and current_user.role != "staff":
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    # Update fields
    for field, value in contact_in.model_dump(exclude_unset=True).items():
        setattr(contact, field, value)
    
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

@router.get("/pending", response_model=List[ContactRead])
def list_pending_contacts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """List pending contacts for current user."""
    contacts = db.query(Contact).filter(
        Contact.status == "pending",
        Contact.contact_id == current_user.id
    ).all()
    return contacts
