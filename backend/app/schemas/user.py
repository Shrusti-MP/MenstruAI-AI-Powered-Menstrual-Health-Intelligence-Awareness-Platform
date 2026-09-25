from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class ProfileResponse(BaseModel):
    id: int
    user_id: int
    preferences: Optional[str] = "{}"
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProfileUpdate(BaseModel):
    preferences: Optional[str] = None


class PrivacyConsentResponse(BaseModel):
    id: int
    user_id: int
    consent_given: bool
    consent_version: str
    consent_date: datetime

    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime
    profile: Optional[ProfileResponse] = None
    privacy_consent: Optional[PrivacyConsentResponse] = None

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class DeleteAccountRequest(BaseModel):
    confirmation: str
