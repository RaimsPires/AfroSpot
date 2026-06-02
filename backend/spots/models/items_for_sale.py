from django.db import models
from django.utils.translation import gettext_lazy as _

from utils.models.models import BaseModel
from spots.models import Spot


class ItemForSale(BaseModel):
    """
    Represents what the spot is actually selling (a haircut, a meal, a physical item).
    """
    class ItemType(models.TextChoices):
        SERVICE = 'service', _('Service (e.g., Haircut, Consultation)')
        PRODUCT = 'product', _('Physical Product (e.g., Food, Clothing)')

    spot = models.ForeignKey(Spot, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    
    item_type = models.CharField(max_length=20, choices=ItemType.choices, default=ItemType.PRODUCT)
    
    # Financials
    price = models.DecimalField(max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) 
    
    # Duration (in minutes) - Crucial for booking services like haircuts
    duration = models.PositiveIntegerField(null=True, blank=True, help_text=_("Duration in minutes for services"))
    
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.spot.name})"