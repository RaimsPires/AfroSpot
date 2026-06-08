from django.db import models
from spots.models.spot import Spot
from utils.models import BaseModel

# 1. The Abstract Base Model (Does NOT create a database table)
class PurchasableItem(BaseModel):
    spot = models.ForeignKey(Spot, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    image = models.ImageField(upload_to='catalog/', blank=True, null=True)

    class Meta:
        abstract = True # 🚀 This tells Django NOT to make a table for this class

# 2. The Product Model (Creates a 'Product' table)
class Product(PurchasableItem):
    stock_quantity = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True)
    requires_shipping = models.BooleanField(default=True)

# 3. The Service Model (Creates a 'Service' table)
class Service(PurchasableItem):
    duration_minutes = models.PositiveIntegerField(help_text="Time it takes to complete")
    buffer_minutes = models.PositiveIntegerField(default=0, help_text="Cleanup time between clients")
    # You could even link this to specific staff members:
    # staff_members = models.ManyToManyField('spots.SpotMember')

# 4. The Ticket Model (Creates a 'Ticket' table)
class Ticket(PurchasableItem):
    event_name = models.CharField(max_length=255)
    event_start_time = models.DateTimeField()
    event_end_time = models.DateTimeField()
    max_capacity = models.PositiveIntegerField()
    qr_code_rules = models.JSONField(blank=True, null=True)