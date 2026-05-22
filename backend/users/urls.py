from django.urls import path, include
from . import views

urlpatterns = [
    # path('auth/registration/verify-email/', views.verify_email_page, name='account_confirm_email'),
    path('auth/', include('auth_kit.urls')),
]