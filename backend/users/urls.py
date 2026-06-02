from django.urls import path, include

from users.views import (
    CheckEmailView,
    PasswordResetLandingView,
    UserAddressCreateView,
    UserAddressSetPrimaryView,
    UserAddressUpdateView,
    VerifyCredentialsView
)

urlpatterns = [
    path('auth/verify-credentials/', VerifyCredentialsView.as_view(), name='verify_credentials'),
    path('password-reset/', PasswordResetLandingView.as_view(), name='password_reset_landing'),
    path('auth/check-email/', CheckEmailView.as_view(), name='auth_check_email'),
    path('auth/addresses/', UserAddressCreateView.as_view(), name='user_address_create'),
    path(
        'auth/addresses/<uuid:address_id>/',
        UserAddressUpdateView.as_view(),
        name='user_address_update',
    ),
    path(
        'auth/addresses/<uuid:address_id>/set-primary/',
        UserAddressSetPrimaryView.as_view(),
        name='user_address_set_primary',
    ),
    #  path('auth/password-reset/request/', views.request_password_reset_otp, name='password_reset_request'),
#     path('auth/password-reset/verify/', views.verify_password_reset_otp, name='password_reset_verify'),
#     path('auth/password-reset/confirm/', views.confirm_password_reset, name='password_reset_confirm'),
    path('auth/', include('auth_kit.urls')),
]