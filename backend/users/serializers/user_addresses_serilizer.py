from rest_framework import serializers
from users.models import UserAddress


class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = '__all__'


class UserAddressCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = [
            'address_type',
            'is_active',
            'address',
            'city',
            'state',
            'zip_code',
            'country',
        ]
    
    @property
    def address_name(self, obj):
        return f"{obj.address}, {obj.city}"
    def __str__(self):
        return f"{self.address_type} - {self.address}, {self.city}, {self.state}, {self.zip_code}, {self.country}"