from django.db import models
from django.utils.translation import gettext_lazy as _

from utils.upload.image_handler import ImageUploadHandler
from utils.models.models import BaseModel
from phonenumber_field.modelfields import PhoneNumberField

class Spot(BaseModel):
    class ShopType(models.TextChoices):
        INDIVIDUAL = 'individual', _('Individual / Freelancer')
        BUSINESS = 'business', _('Registered Business / Location')

    class Category(models.TextChoices):
        RESTAURANT = 'restaurant', _('Restaurant & Food')
        BARBERSHOP = 'barbershop', _('Barbershop')
        SALON = 'salon', _('Hair Dressing Salon')
        RETAIL = 'retail', _('Retail Store')
        OTHER = 'other', _('Other Services')
        
    class Currency(models.TextChoices):
        USD = 'USD', _('US Dollar')
        EUR = 'EUR', _('Euro')
        GBP = 'GBP', _('British Pound')
        NGN = 'NGN', _('Nigerian Naira')
        ZAR = 'ZAR', _('South African Rand')
        # Add more currencies as needed
        
    # Basic Info
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    
    shop_type = models.CharField(
        max_length=20, 
        choices=ShopType.choices, 
        default=ShopType.INDIVIDUAL
    )
    category = models.CharField(
        max_length=30, 
        choices=Category.choices, 
        default=Category.OTHER
    )

    # Location & Geo-Spatial
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    # Contact & Social Commerce
    phone_number = PhoneNumberField(blank=True, null=True)
    whatsapp_number = PhoneNumberField(blank=True, null=True, help_text=_("Crucial for direct customer chat"))
    instagram_handle = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)

    # Visual Identity (Requires 'Pillow' library installed)
    logo = models.ImageField(
        upload_to=ImageUploadHandler('shops/logos/'),
        blank=True, 
        null=True
    )
    
    # Example 3: Different dynamic folder for banners
    banner_image = models.ImageField(
        upload_to=ImageUploadHandler('shops/banners/'),
        blank=True, 
        null=True
    )

    # Status Flags
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    
    currency = models.CharField(max_length=3, choices=Currency.choices, default=Currency.USD)

    def __str__(self):
        return self.name