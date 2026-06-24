from django.db import models
from django.conf import settings
from utils.models import BaseModel


class Promotion(BaseModel):
    DISCOUNT_TYPES = (('percentage', 'Percentage'), ('fixed', 'Fixed'))
    TARGET_CHOICES = (
        ('all_services', 'All Services'),
        ('all_products', 'All Products'),
        ('specific_items', 'Specific Items'),
    )
    
    title = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Use standardized snake_case choices instead of loose frontend strings
    target = models.CharField(max_length=50, choices=TARGET_CHOICES) 
    
    # 🚀 Link to your actual Product and Service models
    products = models.ManyToManyField('spots.Product', blank=True, related_name='promotions')
    services = models.ManyToManyField('spots.Service', blank=True, related_name='promotions')
    
    start_date = models.DateField()
    end_date = models.DateField()

    # 🚀 Dynamic helper methods
    def applies_to_product(self, product_id):
        if self.target == 'all_products':
            return True
        if self.target == 'specific_items':
            return self.products.filter(id=product_id).exists()
        return False

    def applies_to_service(self, service_id):
        if self.target == 'all_services':
            return True
        if self.target == 'specific_items':
            return self.services.filter(id=service_id).exists()
        return False