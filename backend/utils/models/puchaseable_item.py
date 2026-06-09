from django.db import models
from utils.models import BaseModel

class PurchasableItem(BaseModel):
    spot = models.ForeignKey("spots.Spot", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True 