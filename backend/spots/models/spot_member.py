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
        # A user cannot have two different roles in the exact same spot
        constraints = [
            models.UniqueConstraint(fields=['spot', 'user'], name='unique_spot_user_role')
        ]

    def __str__(self):
        return f"{self.user.email} - {self.get_role_display()} at {self.spot.name}"
