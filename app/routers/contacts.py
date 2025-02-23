from typing import Any, List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_active_user
from app.models.users import User
from app.models.contacts import Contact
from app.schemas.contacts import ContactCreate, ContactRead, ContactUpdate, ContactBase

router = APIRouter()

@router.post("/request", response_model=ContactRead)
def request_contact(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    contact_in: ContactBase
) -> Any:
    """
    Request a new contact relationship.
    """
    # Check contact limits
    existing_contacts = db.query(Contact).filter(
        Contact.requestor_id == current_user.id,
        Contact.status == "approved"
    ).count()
    
    if current_user.role == "family" and existing_contacts >= 10:
        raise HTTPException(
            status_code=400,
            detail="Maximum number of contacts (10) reached for family members"
        )
    elif current_user.role == "legal" and existing_contacts >= 50:
        raise HTTPException(
            status_code=400,
            detail="Maximum number of clients (50) reached for legal representatives"
        )
    
    # Create contact request
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
    contact_update: ContactUpdate
) -> Any:
    """
    Approve or reject a contact request.
    """
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Only staff or the contact target can approve/reject
    if current_user.role != "staff" and current_user.id != contact.contact_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    if contact.status != "pending":
        raise HTTPException(status_code=400, detail="Contact request already processed")
    
    contact.status = contact_update.status
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact

@router.get("/pending", response_model=List[ContactRead])
def list_pending_contacts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    List pending contact requests.
    """
    # Staff can see all pending requests
    if current_user.role == "staff":
        contacts = db.query(Contact).filter(Contact.status == "pending").all()
    else:
        # Users see requests they sent or received
        contacts = db.query(Contact).filter(
            Contact.status == "pending",
            (
                (Contact.requestor_id == current_user.id) |
                (Contact.contact_id == current_user.id)
            )
        ).all()
    return contacts

@router.get("/", response_model=List[ContactRead])
def list_contacts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    List all contacts for the current user.
    """
    contacts = db.query(Contact).filter(
        (Contact.requestor_id == current_user.id) |
        (Contact.contact_id == current_user.id)
    ).all()
    return contacts

@router.delete("/{contact_id}")
def remove_contact(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    contact_id: UUID
) -> Any:
    """
    Remove a contact relationship.
    """
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    
    # Only staff, requestor, or contact can remove
    if (
        current_user.role != "staff" and
        current_user.id != contact.requestor_id and
        current_user.id != contact.contact_id
    ):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(contact)
    db.commit()
    return {"msg": "Contact removed"}
