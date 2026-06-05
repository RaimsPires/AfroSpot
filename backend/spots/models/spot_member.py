from django.db import models
from django.utils.translation import gettext_lazy as _
from spots.models.spot import Spot
from utils.models.models import BaseModel
from django.contrib.auth import get_user_model

User = get_user_model()

class SpotMember(BaseModel):
    class Role(models.TextChoices):
        OWNER = 'owner', _('Owner')       
        ADMIN = 'admin', _('Admin')       
        MANAGER = 'manager', _('Manager') 
        STAFF = 'staff', _('Staff')       

    spot = models.ForeignKey(Spot, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='spot_memberships')
    
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.STAFF)
    is_active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['spot', 'user'], name='unique_spot_user_role')
        ]

    def __str__(self):
        return f"{self.user.email} - {self.get_role_display()} at {self.spot.name}"

    def save(self, *args, **kwargs):
        # Check if this is a newly created record (no primary key yet)
        is_new = self._state.adding

        # Call the original save method first so the record is officially created in the DB
        super().save(*args, **kwargs)

        # If it's a new membership, check and update the user's active spot settings
        if is_new:
            from users.models import UserSettings # Lazy import to avoid circular dependency nightmares
            
            # 1. Get or create the UserSettings profile for this specific user
            settings, created = UserSettings.objects.get_or_create(user=self.user)
            
            # 2. If they don't have an active spot set yet, assign this one!
            if not settings.active_spot:
                settings.active_spot = self.spot
                settings.save(update_fields=['active_spot'])