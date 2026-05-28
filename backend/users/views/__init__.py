from .check_email import CheckEmailView
from .password_reset import PasswordResetLandingView
from .user_address import UserAddressCreateView, UserAddressDeleteView, UserAddressSetPrimaryView, UserAddressUpdateView
from .verify_email import VerifyEmailView


__all__ = [
    'CheckEmailView',
    'VerifyEmailView',
    'PasswordResetLandingView',
    'UserAddressCreateView',
    'UserAddressDeleteView',
    'UserAddressSetPrimaryView',
    'UserAddressUpdateView',
]
