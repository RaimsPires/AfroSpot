from rest_framework import serializers
from spots.models import Promotion , Product , Service

class PromotionSerializer(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=Product.objects.all(), required=False)
    services = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=Service.objects.all(), required=False)
    class Meta:
        model = Promotion
        fields = [
            'id', 'title', 'code', 'discount_type', 'discount_value', 
            'target', 'start_date', 'end_date', 'products', 'services'
        ]
        
        
    def create(self, validated_data):
        # 1. Pop the M2M data out of the validated_data
        products = validated_data.pop('products', [])
        services = validated_data.pop('services', [])
        
        # 2. Create the promotion
        promotion = Promotion.objects.create(**validated_data)
        
        # 3. Add the relations
        promotion.products.set(products)
        promotion.services.set(services)
        
        return promotion

    def update(self, instance, validated_data):
        # 1. Pop the M2M data
        products = validated_data.pop('products', None)
        services = validated_data.pop('services', None)
        
        # 2. Update the promotion fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # 3. Update relations only if they were provided in the request
        if products is not None:
            instance.products.set(products)
        if services is not None:
            instance.services.set(services)
            
        return instance