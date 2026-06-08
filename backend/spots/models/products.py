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

    class Meta:
        abstract = True # 🚀 This tells Django NOT to make a table for this class

# 2. The Product Model (Creates a 'Product' table)
class Product(PurchasableItem):
    stock_quantity = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True)
    requires_shipping = models.BooleanField(default=True)
    
    

class ProductImage(BaseModel):
    # The related_name='images' allows you to easily fetch all images for a product
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    
    image = models.ImageField(upload_to='products/gallery/')
    alt_text = models.CharField(max_length=255, blank=True, help_text="Good for SEO and accessibility")
    
    # Allows the user to select which image shows up first on the main list
    is_primary = models.BooleanField(default=False)
    
    # Allows the user to drag-and-drop to reorder their gallery
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order'] # Always returns images in the correct order

    def __str__(self):
        return f"Image for {self.product.name}"

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