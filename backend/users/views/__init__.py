from .password_reset import PasswordResetLandingView
from .user_address import UserAddressCreateView, UserAddressSetPrimaryView, UserAddressUpdateView
from .verify_email import VerifyEmailView


__all__ = [
    'VerifyEmailView',
    'PasswordResetLandingView',
    'UserAddressCreateView',
    'UserAddressSetPrimaryView',
    'UserAddressUpdateView',
]
