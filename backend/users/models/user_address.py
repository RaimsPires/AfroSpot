from utils.models import BaseModel
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _


User = get_user_model()

class UserAddress(BaseModel):
    ADDRESS_TYPE_CHOICES = [
        ('home', _('Home')),
        ('work', _('Work')),
        ('other', _('Other')),
    ]
    address_type = models.CharField(max_length=50, choices=ADDRESS_TYPE_CHOICES)
    is_active = models.BooleanField(default=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    
    class Meta:
        verbose_name = 'User Address'
        verbose_name_plural = 'User Addresses'
        db_table = 'user_addresses'
    
    def __str__(self):
            return f"{self.address}, {self.city}"