from datetime import datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class VideoCallBase(BaseModel):
    creator_id: UUID
    room_name: str
    scheduled_start: datetime
    scheduled_duration: int
    max_participants: int
    participant_ids: List[UUID]
    recording_enabled: bool

class VideoCallCreate(VideoCallBase):
    pass

class VideoCallRead(VideoCallBase):
    id: UUID
    status: str
    recording_status: Optional[str]
    created_at: datetime
    updated_at: datetime
    participant_ids: List[str]  # Override to ensure string UUIDs in response
    token: Optional[str] = None  # Include token in response

    model_config = ConfigDict(from_attributes=True)

class VideoCallUpdate(BaseModel):
    status: Optional[str] = None
    recording_status: Optional[str] = None
    scheduled_start: Optional[datetime] = None
    scheduled_duration: Optional[int] = None
    max_participants: Optional[int] = None
    participant_ids: Optional[List[UUID]] = None

    model_config = ConfigDict(from_attributes=True)
