from django.db import models
from django.utils.translation import gettext_lazy as _
from utils.models.models import BaseModel
from spots.models.events import Event


class EventTicketTier(BaseModel):
    """
    Allows a single event to have multiple ticket types (e.g., Regular, VIP, Table of 5)
    """
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='ticket_tiers')
    name = models.CharField(max_length=100) # e.g., "Early Bird", "VIP Access"
    description = models.TextField(blank=True, help_text=_("What does this ticket include?"))
    
    # Set price to 0.00 for Free RSVP events
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    
    # Inventory Management
    capacity = models.PositiveIntegerField(help_text=_("Total number of tickets available for this tier"))
    quantity_sold = models.PositiveIntegerField(default=0)
    
    # Optional: Automatically start/stop selling these specific tickets
    sales_start = models.DateTimeField(null=True, blank=True)
    sales_end = models.DateTimeField(null=True, blank=True)

    is_active = models.BooleanField(default=True)

    @property
    def is_sold_out(self):
        return self.quantity_sold >= self.capacity

    def __str__(self):
        return f"{self.name} - {self.event.title}"