from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User, Profile, PrivacyConsent
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    MessageResponse,
)
from app.schemas.user import UserResponse, TokenResponse
from app.auth.security import hash_password, verify_password
from app.auth.jwt import create_access_token, decode_access_token
from app.auth.dependencies import get_current_active_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # 1. Validate password confirmation
    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match."
        )

    # 2. Validate privacy consent
    if not request.privacy_consent:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must accept the Privacy Policy to create an account."
        )

    # 3. Check duplicate email
    existing_user = db.query(User).filter(User.email == request.email.lower()).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email address already exists."
        )

    # 4. Hash password securely
    hashed_pwd = hash_password(request.password)

    # 5. Create user
    user = User(
        name=request.name.strip(),
        email=request.email.lower().strip(),
        password_hash=hashed_pwd,
        role="USER",
        is_active=True,
    )
    db.add(user)
    db.flush()

    # 6. Create Profile & Privacy Consent
    profile = Profile(user_id=user.id, preferences="{}")
    privacy = PrivacyConsent(
        user_id=user.id,
        consent_given=True,
        consent_version="1.0",
        consent_date=datetime.now(timezone.utc),
    )
    db.add(profile)
    db.add(privacy)
    db.commit()
    db.refresh(user)

    # 7. Generate JWT token
    token = create_access_token(subject=user.id)

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email.lower().strip()).first()
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This account has been deactivated."
        )

    token = create_access_token(subject=user.id)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.post("/logout", response_model=MessageResponse)
def logout(current_user: User = Depends(get_current_active_user)):
    return MessageResponse(message="Successfully logged out.")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_active_user)):
    return UserResponse.model_validate(current_user)


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email.lower().strip()).first()
    if not user:
        # Don't leak user existence in production; safe message
        return MessageResponse(
            message="If the email exists, a password reset instruction has been generated.",
            detail="Development mode: Use the generated reset token."
        )

    # Create password reset token valid for 30 minutes
    reset_token = create_access_token(subject=f"reset:{user.id}")
    return MessageResponse(
        message="Password reset instruction generated.",
        detail=f"Dev Reset Token: {reset_token}"
    )


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    payload = decode_access_token(request.token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token."
        )

    sub: str = payload.get("sub", "")
    if not sub.startswith("reset:"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid token type."
        )

    try:
        user_id = int(sub.split(":")[1])
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Malformed token."
        )

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found."
        )

    user.password_hash = hash_password(request.new_password)
    db.commit()
    return MessageResponse(message="Password successfully reset. You may now login.")
