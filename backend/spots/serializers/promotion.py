from rest_framework import serializers
from spots.models import Promotion , Product , Service
from drf_spectacular.utils import extend_schema_field
from drf_spectacular.types import OpenApiTypes

class PromotionSerializer(serializers.ModelSerializer):
    products = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=Product.objects.all(), required=False)
    services = serializers.PrimaryKeyRelatedField(many=True, read_only=False, queryset=Service.objects.all(), required=False)
    
    items_details = serializers.SerializerMethodField()
    class Meta:
        model = Promotion
        fields = [
            'id', 'title', 'code', 'discount_type', 'discount_value', 
            'target', 'start_date', 'end_date', 'products', 'services','items_details'
        ]
    
    @extend_schema_field(OpenApiTypes.OBJECT) # Tells Swagger it returns a list of objects
    def get_items_details(self, obj):
        # 1. Fetch related objects
        products = obj.products.all()
        services = obj.services.all()
        
        details = []
        
        # 2. Standardize Product data
        for p in products:
            details.append({
                "id": str(p.id),
                "name": p.name,
                "image": self.context['request'].build_absolute_uri(p.image.url) if hasattr(p, 'image') and p.image else None,
                "type": "product"
            })
            
        # 3. Standardize Service data
        for s in services:
            details.append({
                "id": str(s.id),
                "name": s.name,
                "image": self.context['request'].build_absolute_uri(s.image.url) if hasattr(s, 'image') and s.image else None,
                "type": "service"
            })
            
        return details
        
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