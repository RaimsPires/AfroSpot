from rest_framework import serializers
from spots.models import Product 

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock_quantity', 'image', 'is_active']
        read_only_fields = ['id', 'spot']

    def create(self, validated_data):
        # Automatically assign the product to the user's active spot
        active_spot = self.context['request'].user.settings.active_spot
        validated_data['spot'] = active_spot
        return super().create(validated_data)