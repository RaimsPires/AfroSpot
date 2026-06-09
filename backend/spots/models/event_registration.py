from django.db import models
from django.utils.translation import gettext_lazy as _
from utils.models.models import BaseModel
from spots.models.even_ticket_tier import EventTicketTier
import uuid



class EventRegistration(BaseModel):
    """
    The actual ticket held by the user. 
    Generates a unique ID that can be turned into a QR code in the React Native app.
    """
    class RegistrationStatus(models.TextChoices):
        CONFIRMED = 'confirmed', _('Confirmed')
        CANCELLED = 'cancelled', _('Cancelled')
        ATTENDED = 'attended', _('Attended (Checked In)')

    # A secure, random string that is impossible to guess (Used for QR Codes)
    ticket_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    event = models.ForeignKey('spots.Event', on_delete=models.CASCADE, related_name='attendees')
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name='my_tickets')
    ticket_tier = models.ForeignKey(EventTicketTier, on_delete=models.PROTECT, related_name='registrations')

    status = models.CharField(max_length=20, choices=RegistrationStatus.choices, default=RegistrationStatus.CONFIRMED)
    
    # How much did they actually pay at checkout? (Crucial for accounting in case ticket prices changed)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    order = models.ForeignKey("spots.EventOrder", on_delete=models.RESTRICT)

    class Meta:
        # Prevent users from double-booking the exact same ticket tier by accident
        constraints = [
            models.UniqueConstraint(
                fields=['event', 'user', 'ticket_tier'], 
                name='unique_user_ticket_per_event'
            )
        ]
        db_table = "registration_status"

    def __str__(self):
        return f"Ticket {self.ticket_id} - {self.user.email} ({self.event.title})"