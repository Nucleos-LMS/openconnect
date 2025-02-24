from uuid import uuid4, UUID
import json
from sqlalchemy import Column, String, Enum, ForeignKey, DateTime, Boolean, Integer, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from app.models.base import TimestampMixin

class VideoCall(Base, TimestampMixin):
    __tablename__ = "video_calls"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    creator_id = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    room_name = Column(String, unique=True)
    status = Column(Enum('scheduled', 'active', 'completed', 'cancelled', name='call_status'))
    scheduled_start = Column(DateTime(timezone=True))
    scheduled_duration = Column(Integer)  # Duration in minutes
    max_participants = Column(Integer)
    _participant_ids = Column('participant_ids', Text)  # Store as JSON string
    
    # Core recording fields (no security features)
    recording_enabled = Column(Boolean, default=False)
    recording_status = Column(Enum('inactive', 'active', 'paused', 'completed', name='recording_status'))

    def dict(self):
        """Convert model to dict for response."""
        return {
            "id": str(self.id),
            "creator_id": str(self.creator_id),
            "room_name": self.room_name,
            "status": self.status,
            "scheduled_start": self.scheduled_start,
            "scheduled_duration": self.scheduled_duration,
            "max_participants": self.max_participants,
            "participant_ids": self.participant_ids,
            "recording_enabled": self.recording_enabled,
            "recording_status": self.recording_status,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

    @property
    def participant_ids(self):
        if self._participant_ids is None:
            return []
        return [str(UUID(id_str)) for id_str in json.loads(self._participant_ids)]
    
    @participant_ids.setter
    def participant_ids(self, value):
        if value is None:
            self._participant_ids = None
        else:
            self._participant_ids = json.dumps([str(id) for id in value])
