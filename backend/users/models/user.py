from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from utils.upload import ImageUploadHandler
from users.manager import UserManager
from utils.models import BaseModel
from phonenumber_field.modelfields import PhoneNumberField
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    email = models.EmailField(unique=True, db_index=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    phone_number = PhoneNumberField(region=None, blank=True, null=True,)
    dob = models.DateField(null=True, blank=True)
    profile_picture = models.ImageField(upload_to=ImageUploadHandler('users/profile_pictures'), null=True, blank=True)
    language = models.CharField(max_length=10,choices=settings.LANGUAGES,default=settings.LANGUAGE_CODE)
    
    is_client = models.BooleanField(default=True, help_text=_("Designates if user can buy/browse as a client."))
    is_store_owner = models.BooleanField(default=False, help_text=_("Designates if user owns a business/spot."))
    
    # Required Django fields
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    
    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        db_table = 'users'
        
        
    def __str__(self):
        return self.email
    
    def get_full_name(self):
        """Return the first_name plus the last_name, with a space in between."""
        full_name = f"{self.first_name} {self.last_name}"
        return full_name.strip() or self.email

    def get_short_name(self):
        """Return the short name for the user."""
        return self.first_name or self.email.split('@')[0]
    
    @property
    def is_dual_user(self):
        """Helper property to easily check if they are both."""
        return self.is_client and self.is_store_owner