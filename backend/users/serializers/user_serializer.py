from rest_framework import serializers
from django.contrib.auth import get_user_model
from .setting_serializer import SettingSerializer
from users.serializers import UserAddressSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    settings = SettingSerializer()
    addresses = UserAddressSerializer(many=True, read_only=True)
    full_name = serializers.SerializerMethodField()
    active_address = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'dob', 'profile_picture', 'language', 'is_store_owner' , 'is_staff', 'is_active', 'date_joined','settings', 'addresses', 'full_name', 'active_address']
        read_only_fields = ['id', 'email','is_staff', 'is_active', 'date_joined','full_name', 'active_address']
        
    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()
    def get_active_address(self, obj):
        active_address = obj.addresses.filter(is_active=True).first()
        return str(active_address) if active_address and active_address.address_name else None