from django.db import models
from django.utils.translation import gettext_lazy as _
from utils.models.models import BaseModel
import uuid

class EventVendorBooking(BaseModel):
    """
    Manages vendors (food, merch, sponsors) applying to set up at an event.
    """
    class VendorStatus(models.TextChoices):
        PENDING = 'pending', _('Pending Approval')
        APPROVED = 'approved', _('Approved')
        REJECTED = 'rejected', _('Rejected')

    event = models.ForeignKey("spots.Event", on_delete=models.CASCADE, related_name='vendors')
    # If the vendor is also a Spot on your app, you can link them!
    vendor_spot = models.ForeignKey("spots.Spot", on_delete=models.CASCADE, related_name='event_applications')
    
    business_name = models.CharField(max_length=255)
    vendor_type = models.CharField(max_length=100, help_text=_("e.g., Food Truck, Merch, Sponsor"))
    requirements = models.TextField(blank=True, help_text=_("e.g., Need 2 power outlets and a 10x10 tent space"))
    
    status = models.CharField(max_length=20, choices=VendorStatus.choices, default=VendorStatus.PENDING)
    fee_paid = models.BooleanField(default=False, help_text=_("Has the vendor paid their booth fee?"))

    def __str__(self):
        return f"{self.business_name} at {self.event.title}"