# Import Base first
from app.models.base import Base  # noqa: F401

# Import models
from app.models.facilities import Facility  # noqa: F401
from app.models.users import User  # noqa: F401
from app.models.contacts import Contact  # noqa: F401
from app.models.video_calls import VideoCall  # noqa: F401
