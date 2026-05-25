from .password_reset import PasswordResetLandingView
from .user_address import UserAddressCreateView, UserAddressSetPrimaryView
from .verify_email import VerifyEmailView


__all__ = [
    'VerifyEmailView',
    'PasswordResetLandingView',
    'UserAddressCreateView',
    'UserAddressSetPrimaryView',
]
