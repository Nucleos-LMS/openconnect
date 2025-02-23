from datetime import datetime
from typing import Optional, Dict, Any, List
from uuid import UUID
from pydantic import BaseModel, ConfigDict, constr

class NetworkSettings(BaseModel):
    max_bandwidth: int  # kbps
    allowed_ip_ranges: List[str]
    vpn_required: bool = False
    latency_threshold: int = 150  # ms

class DeviceSettings(BaseModel):
    allowed_browsers: List[str]
    min_browser_version: str
    allowed_devices: List[str]
    require_camera: bool = True
    require_microphone: bool = True

class SecuritySettings(BaseModel):
    require_vpn: bool = False
    allowed_auth_methods: List[str]
    session_timeout: int = 30  # minutes
    max_failed_attempts: int = 5
    password_policy: Dict[str, Any]

class DeploymentSettings(BaseModel):
    deployment_type: str = "cloud"  # cloud, self-hosted, hybrid
    update_policy: str = "automatic"  # automatic, manual
    backup_policy: Dict[str, Any]
    maintenance_window: Dict[str, Any]

class FacilitySettings(BaseModel):
    network: NetworkSettings = NetworkSettings(
        max_bandwidth=1000,
        allowed_ip_ranges=[],
        vpn_required=False,
        latency_threshold=150
    )
    devices: DeviceSettings = DeviceSettings(
        allowed_browsers=["chrome", "firefox"],
        min_browser_version="90",
        allowed_devices=["desktop", "mobile"],
        require_camera=True,
        require_microphone=True
    )
    security: SecuritySettings = SecuritySettings(
        require_vpn=False,
        allowed_auth_methods=["password"],
        session_timeout=30,
        max_failed_attempts=5,
        password_policy={}
    )
    deployment: DeploymentSettings = DeploymentSettings(
        deployment_type="cloud",
        update_policy="automatic",
        backup_policy={},
        maintenance_window={}
    )
    custom_settings: Optional[Dict[str, Any]] = None

class FacilityBase(BaseModel):
    name: constr(min_length=1, max_length=255)
    settings: FacilitySettings

class FacilityCreate(FacilityBase):
    pass

class FacilityRead(FacilityBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class FacilityUpdate(BaseModel):
    name: Optional[constr(min_length=1, max_length=255)] = None
    settings: Optional[FacilitySettings] = None

    model_config = ConfigDict(from_attributes=True)
