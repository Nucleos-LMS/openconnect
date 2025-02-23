from sqlalchemy.orm import relationship
from app.models.users import User
from app.models.contacts import Contact

# Set up relationships after all models are defined
User.outgoing_contacts = relationship(
    "Contact",
    primaryjoin="User.id == Contact.requestor_id",
    back_populates="requestor"
)
User.incoming_contacts = relationship(
    "Contact",
    primaryjoin="User.id == Contact.contact_id",
    back_populates="contact"
)

Contact.requestor = relationship(
    "User",
    primaryjoin="Contact.requestor_id == User.id",
    back_populates="outgoing_contacts"
)
Contact.contact = relationship(
    "User",
    primaryjoin="Contact.contact_id == User.id",
    back_populates="incoming_contacts"
)
