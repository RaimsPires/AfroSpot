from django.db import models
from django.utils.translation import gettext_lazy as _
from utils.models.models import BaseModel
import uuid


class EventOrder(BaseModel):
    """
    Groups multiple EventRegistrations (tickets) into a single checkout transaction.
    """
    class PaymentStatus(models.TextChoices):
        PENDING = 'pending', _('Pending')
        SUCCESS = 'success', _('Success')
        FAILED = 'failed', _('Failed')
        REFUNDED = 'refunded', _('Refunded')

    order_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    user = models.ForeignKey("users.User", on_delete=models.CASCADE, related_name='event_orders')
    event = models.ForeignKey("spots.Event", on_delete=models.CASCADE)
    
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.PENDING)
    
    # Crucial for matching with Stripe / Paystack / Flutterwave
    payment_gateway_reference = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.status}"

# Note: You will need to add an `order = models.ForeignKey(EventOrder)` 
# to your existing `EventRegistration` model so tickets link to their receipt!


