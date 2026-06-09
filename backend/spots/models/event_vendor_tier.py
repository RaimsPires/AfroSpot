from django.db import models
from django.utils.translation import gettext_lazy as _
from utils.models.models import BaseModel
from spots.models import Event


class EventVendorTier(BaseModel):
    """
    Defines the types of vendor stalls available for an event and their pricing.
    """
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='vendor_tiers')
    name = models.CharField(max_length=100, help_text=_("e.g., Food Stall, Merch Table"))
    description = models.TextField(blank=True, help_text=_("What does the vendor get?"))
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Inventory Management
    capacity = models.PositiveIntegerField(help_text=_("Total number of stalls available of this type"))
    quantity_sold = models.PositiveIntegerField(default=0)
    
    is_active = models.BooleanField(default=True)

    @property
    def is_sold_out(self):
        return self.quantity_sold >= self.capacity

    def __str__(self):
        return f"{self.name} - {self.event.title}"
    
    class Meta:
        db_table = "event_vendor_tier"