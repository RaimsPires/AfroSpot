from django.urls import path
from .views import RegisterAllView, VerifyBusinessRegistrationEmailView

urlpatterns = [
    path('spots/register-all/', RegisterAllView.as_view(), name='register-all'),
    path('spots/verify-registration-email/', VerifyBusinessRegistrationEmailView.as_view(), name='verify-registration-email'),
]