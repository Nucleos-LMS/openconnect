from typing import Any, List
from uuid import UUID, uuid4
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_active_user
from app.models.users import User
from app.models.video_calls import VideoCall
from app.schemas.video_calls import VideoCallBase, VideoCallCreate, VideoCallRead, VideoCallUpdate

router = APIRouter()

@router.post("/create", response_model=VideoCallRead)
def create_call(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    call_in: VideoCallBase
) -> Any:
    """Create a new video call."""
    # Validate participant list
    participants = db.query(User).filter(
        User.id.in_(call_in.participant_ids)
    ).all()
    if len(participants) != len(call_in.participant_ids):
        raise HTTPException(
            status_code=400,
            detail="Invalid participant IDs"
        )
    
    # Create call
    call = VideoCall(
        creator_id=current_user.id,
        room_name=f"call-{uuid4()}",  # Generate unique room name
        status="scheduled",
        scheduled_start=call_in.scheduled_start,
        scheduled_duration=call_in.scheduled_duration,
        max_participants=call_in.max_participants,
        participant_ids=call_in.participant_ids,
        recording_enabled=call_in.recording_enabled and current_user.role != "attorney"  # No recording for legal calls
    )
    db.add(call)
    db.commit()
    db.refresh(call)
    
    # Generate token for the room
    from app.providers.twilio import generate_room_token
    token = generate_room_token(call.room_name, str(current_user.id))
    
    response = call.dict()
    response["token"] = token
    return response

@router.post("/{call_id}/join")
def join_call(
    *,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
    call_id: UUID
) -> Any:
    """Join a video call."""
    call = db.query(VideoCall).filter(VideoCall.id == call_id).first()
    if not call:
        raise HTTPException(status_code=404, detail="Call not found")
    
    # Check if user is allowed to join
    if current_user.id not in call.participant_ids and current_user.role != "staff":
        raise HTTPException(
            status_code=403,
            detail="Not authorized to join this call"
        )
    
    # Check call status
    if call.status not in ["scheduled", "active"]:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot join call with status: {call.status}"
        )
    
    # Update call status if needed
    if call.status == "scheduled":
        call.status = "active"
        db.add(call)
        db.commit()
    
    # Generate Twilio token for the room
    from app.providers.twilio import generate_room_token
    token = generate_room_token(call.room_name, str(current_user.id))
    
    return {
        "room_name": call.room_name,
        "recording_enabled": call.recording_enabled,
        "duration": call.scheduled_duration,
        "token": token
    }

@router.get("/scheduled", response_model=List[VideoCallRead])
def list_scheduled_calls(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """List scheduled calls for current user."""
    # Staff can see all calls
    if current_user.role == "staff":
        calls = db.query(VideoCall).filter(
            VideoCall.status == "scheduled"
        ).all()
    else:
        # Users see calls they're participating in
        calls = db.query(VideoCall).filter(
            VideoCall.status == "scheduled",
            VideoCall.participant_ids.contains([current_user.id])
        ).all()
    return calls
