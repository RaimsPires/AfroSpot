from django.db import models
from users.models import User


class UserSettings(models.Model):
    THEME_CHOICES = [
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('system', 'System Default'),
    ]

    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='settings'
    )
    
    country_of_residence = models.CharField(max_length=100, blank=True)
    theme = models.CharField(max_length=10, choices=THEME_CHOICES, default='system')
    email_notifications = models.BooleanField(default=True)
    email_verifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    marketing_emails = models.BooleanField(default=False)
    country_of_origin = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.email} - Settings"