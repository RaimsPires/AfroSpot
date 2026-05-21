from rest_framework import serializers
from django.contrib.auth import get_user_model
from .setting_serializer import SettingSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    settings = SettingSerializer()
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'dob', 'profile_picture', 'language', 'is_store_owner' , 'is_staff', 'is_active', 'date_joined','settings']
        read_only_fields = ['id', 'email','is_staff', 'is_active', 'date_joined']