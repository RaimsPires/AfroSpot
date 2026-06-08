from rest_framework import serializers
from django.db import transaction
from spots.models import Service, ServiceImage # Adjust import path

class ServiceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceImage
        fields = ['id', 'image', 'is_primary', 'display_order', 'alt_text']

class ServiceSerializer(serializers.ModelSerializer):
    images = ServiceImageSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = [
            'id', 'name', 'description', 'price', 
            'duration_minutes', 'buffer_minutes', 'is_active', 'images'
        ]
        read_only_fields = ['id', 'spot', 'images']

    @transaction.atomic
    def create(self, validated_data):
        request = self.context['request']
        
        # 1. Assign to the manager's active spot
        validated_data['spot'] = request.user.settings.active_spot

        # 2. Create the base service
        service = super().create(validated_data)

        # 3. Process the Primary Image
        primary_image = request.FILES.get('primary_image')
        if primary_image:
            ServiceImage.objects.create(
                service=service, image=primary_image, is_primary=True, display_order=0
            )

        # 4. Process the Gallery Images (Max 10)
        gallery_images = request.FILES.getlist('gallery_images')
        for index, image in enumerate(gallery_images[:10]): 
            ServiceImage.objects.create(
                service=service,
                image=image,
                is_primary=False,
                display_order=index + 1
            )

        return service

    @transaction.atomic
    def update(self, instance, validated_data):
        request = self.context['request']
        service = super().update(instance, validated_data)

        # On edit, we ONLY process a new primary image if one was uploaded
        primary_image = request.FILES.get('primary_image')
        if primary_image:
            existing_primary = service.images.filter(is_primary=True).first()
            if existing_primary:
                existing_primary.image = primary_image
                existing_primary.save()
            else:
                ServiceImage.objects.create(
                    service=service, image=primary_image, is_primary=True, display_order=0
                )

        return service