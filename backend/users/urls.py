from django.urls import path, include

from users.views import PasswordResetLandingView

urlpatterns = [
    path('password-reset/', PasswordResetLandingView.as_view(), name='password_reset_landing'),
    #  path('auth/password-reset/request/', views.request_password_reset_otp, name='password_reset_request'),
#     path('auth/password-reset/verify/', views.verify_password_reset_otp, name='password_reset_verify'),
#     path('auth/password-reset/confirm/', views.confirm_password_reset, name='password_reset_confirm'),
    path('auth/', include('auth_kit.urls')),
]