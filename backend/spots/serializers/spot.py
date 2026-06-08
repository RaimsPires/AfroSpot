from rest_framework import serializers
from spots.models.spot import Spot

class SpotSerializer(serializers.ModelSerializer):
    description = serializers.CharField(max_length=200, allow_blank=True)
    class Meta:
        model = Spot
        fields = [
            'id', 'name', 'description', 'email', 'shop_type', 'category',
            'address', 'city', 'country', 'phone_number', 'whatsapp_number',
            'instagram_handle', 'website', 'currency'
        ]
        read_only_fields = ['id']