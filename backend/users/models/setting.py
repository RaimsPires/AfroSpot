from django.db import models
from users.models import User
from utils.models import BaseModel
from django.utils.translation  import gettext_lazy as _


class UserSettings(BaseModel):
    THEME_CHOICES = [
        ('light', _('Light')),
        ('dark', _('Dark')),
        ('system', _('System Default')),
    ]

    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='settings'
    )
    
    country = models.CharField(max_length=100, blank=True)
    country_of_origin = models.CharField(max_length=100, blank=True)
    
    theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='system')
    email_notifications = models.BooleanField(default=True)
    email_verifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    marketing_emails = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.email} - Settings"