from django.db import models
from utils.models import PurchasableItem
from utils.models import BaseModel
from utils.upload import ImageUploadHandler

class Product(PurchasableItem):
    stock_quantity = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True)
    requires_shipping = models.BooleanField(default=True)
    
    class Meta:
        db_table = "products"
    
    

class ProductImage(BaseModel):
    # The related_name='images' allows you to easily fetch all images for a product
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    
    image = models.ImageField(upload_to=ImageUploadHandler('products/gallery/'))
    alt_text = models.CharField(max_length=255, blank=True, help_text="Good for SEO and accessibility")
    
    # Allows the user to select which image shows up first on the main list
    is_primary = models.BooleanField(default=False)
    
    # Allows the user to drag-and-drop to reorder their gallery
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "product_images"
        ordering = ['display_order'] # Always returns images in the correct order

    def __str__(self):
        return f"Image for {self.product.name}"

