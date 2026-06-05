import uuid
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from utils.models.models import BaseModel
from spots.models.spot import Spot

class SpotInvitation(BaseModel):
    class Status(models.TextChoices):
        PENDING = 'pending', _('Pending Response')
        ACCEPTED = 'accepted', _('Accepted')
        REVOKED = 'revoking', _('Revoked / Cancelled')
        EXPIRED = 'expired', _('Expired')

    spot = models.ForeignKey(Spot, on_delete=models.CASCADE, related_name='invitations')
    email = models.EmailField(db_index=True)
    role = models.CharField(max_length=20, default='staff')
    token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    expires_at = models.DateTimeField()

    class Meta:
        ordering = ['-created_at']
        db_table = "spot_invitations"

    def save(self, *args, **kwargs):
        if not self.expires_at:
            # Invitations expire automatically after 7 days
            self.expires_at = timezone.now() + timezone.timedelta(days=7)
        super().save(*args, **kwargs)

    @property
    def is_valid(self):
        return self.status == self.Status.PENDING and self.expires_at > timezone.now()

    def __str__(self):
        return f"Invite to {self.email} for {self.spot.name} ({self.get_status_display()})"