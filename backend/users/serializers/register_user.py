
from django.contrib.auth import get_user_model
from auth_kit.serializers.registration import RegisterSerializer
from rest_framework import serializers
from users.models import UserSettings

User = get_user_model()

class RegisterUserSerializer(RegisterSerializer):
    dob = serializers.DateField(required=False)
    country = serializers.CharField(required=False)
    phone_number = serializers.CharField(required=False)
    profile_picture = serializers.ImageField(required=False)
    language = serializers.CharField(required=False)
    
    class Meta:
        extra_kwargs = {'password1': {'write_only': True}}
        
    def save(self, **kwargs):
        user = super().save(**kwargs)
        data = self.validated_data
        country = data.get('country')

        user.dob = data.get('dob')
        user.phone_number = data.get('phone_number')
        user.profile_picture = data.get('profile_picture')
        user.language = data.get('language')
        user.save()

        UserSettings.objects.create(user=user, country=country or '')
        return user