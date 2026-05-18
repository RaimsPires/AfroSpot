from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
from backend.core import settings
from backend.core.upload import user_profile_image_path
from users.manager import UserManager
from core.models import BaseModel
from phonenumber_field.modelfields import PhoneNumberField

class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    phone_number = PhoneNumberField(region=None, blank=True, null=True, unique=True)
    country_code = models.CharField(max_length=5, blank=True) 
    dob = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to=user_profile_image_path, null=True, blank=True)
    language = models.CharField(max_length=10,choices=settings.LANGUAGES,default=settings.LANGUAGE_CODE)
    is_store_owner = models.BooleanField(default=False)
    
    # Required Django fields
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    
    

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """Return the first_name plus the last_name, with a space in between."""
        full_name = f"{self.first_name} {self.last_name}"
        return full_name.strip() or self.email

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name or self.email.split('@')[0]