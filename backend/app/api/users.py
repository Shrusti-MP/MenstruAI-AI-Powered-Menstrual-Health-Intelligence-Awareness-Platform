from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate, DeleteAccountRequest
from app.schemas.auth import MessageResponse
from app.auth.dependencies import get_current_active_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_user_profile(current_user: User = Depends(get_current_active_user)):
    return UserResponse.model_validate(current_user)


@router.put("/me", response_model=UserResponse)
def update_user_profile(
    update_data: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if update_data.name is not None and update_data.name.strip():
        current_user.name = update_data.name.strip()
    if update_data.email is not None and update_data.email.strip():
        new_email = update_data.email.lower().strip()
        if new_email != current_user.email:
            existing = db.query(User).filter(User.email == new_email).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Email already in use by another account."
                )
            current_user.email = new_email

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.delete("/me", response_model=MessageResponse)
def delete_user_account(
    request: DeleteAccountRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    if request.confirmation.strip().upper() != "DELETE":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Confirmation text must be 'DELETE' to proceed with account deletion."
        )

    # Cascading foreign keys will delete profile, privacy consent, tracking records, quiz attempts
    db.delete(current_user)
    db.commit()

    return MessageResponse(message="Your account and all associated data have been permanently deleted.")
