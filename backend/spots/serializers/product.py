import uuid
from rest_framework import serializers
from django.db import transaction
from spots.models import Product, ProductImage

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_primary', 'display_order', 'alt_text']

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock_quantity', 'sku', 'is_active', 'images']
        read_only_fields = ['id', 'spot', 'sku', 'images']

    @transaction.atomic # Ensures if an image upload fails, the whole product creation rolls back safely
    def create(self, validated_data):
        request = self.context['request']
        validated_data['spot'] = request.user.settings.active_spot
        
        if 'sku' not in validated_data:
            validated_data['sku'] = f"PRD-{uuid.uuid4().hex[:8].upper()}"

        # Create the base product
        product = super().create(validated_data)

        # 1. Process the Primary Image
        primary_image = request.FILES.get('primary_image')
        if primary_image:
            ProductImage.objects.create(
                product=product, image=primary_image, is_primary=True, display_order=0
            )

        # 2. Process the Gallery Images (Max 10)
        gallery_images = request.FILES.getlist('gallery_images')
        for index, image in enumerate(gallery_images[:10]): 
            ProductImage.objects.create(
                product=product,
                image=image,
                is_primary=False,
                display_order=index + 1 # Maintains the exact order they dragged them into!
            )

        return product

    @transaction.atomic
    def update(self, instance, validated_data):
        request = self.context['request']
        product = super().update(instance, validated_data)

        # 🚀 As requested: On edit, we ONLY allow updating the primary image
        primary_image = request.FILES.get('primary_image')
        if primary_image:
            # Find the existing primary image and replace it, or create one if it didn't exist
            existing_primary = product.images.filter(is_primary=True).first()
            if existing_primary:
                existing_primary.image = primary_image
                existing_primary.save()
            else:
                ProductImage.objects.create(
                    product=product, image=primary_image, is_primary=True, display_order=0
                )

        return product