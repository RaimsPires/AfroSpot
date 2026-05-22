from django.db import transaction
from django.contrib.auth import get_user_model
from auth_kit.serializers.registration import RegisterSerializer
from rest_framework import serializers
from users.models import UserSettings
from phonenumber_field.serializerfields import PhoneNumberField

User = get_user_model()

class RegisterUserSerializer(RegisterSerializer):
    dob = serializers.DateField(required=False)
    country = serializers.CharField(required=False)
    phone_number = PhoneNumberField(required=False)
    profile_picture = serializers.ImageField(required=False)
    language = serializers.CharField(required=False)
    
    class Meta:
        extra_kwargs = {'password1': {'write_only': True}}
        
    @transaction.atomic
    def save(self, **kwargs):
        country = self.validated_data.pop('country', '')
        extra_profile_data = {
            'dob': self.validated_data.pop('dob', None),
            'phone_number': self.validated_data.pop('phone_number', None),
            'profile_picture': self.validated_data.pop('profile_picture', None),
            'language': self.validated_data.pop('language', None),
        }

        user = super().save(**kwargs)
        
        for field, value in extra_profile_data.items():
            setattr(user, field, value)
        
        user.save()
        UserSettings.objects.create(user=user, country=country)
        
        return user
