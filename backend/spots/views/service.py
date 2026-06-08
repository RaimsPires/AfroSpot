from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

from spots.models import Service, ServiceImage
from spots.serializers import ServiceSerializer, ServiceImageSerializer # Adjust import

class ServiceViewSet(viewsets.ModelViewSet):
    """
    Handles creating, listing, updating, and deleting Services.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Service.objects.none()
            
        active_spot = getattr(self.request.user.settings, 'active_spot', None)
        if not active_spot:
            return Service.objects.none()
            
        return Service.objects.filter(spot=active_spot).order_by('-id')


class ServiceImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles fetching, updating (PATCH for is_primary), and deleting a specific service image.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ServiceImageSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return ServiceImage.objects.none()
            
        active_spot = getattr(self.request.user.settings, 'active_spot', None)
        if not active_spot:
            return ServiceImage.objects.none()

        # Ensure the image belongs to a service that belongs to the manager's active spot
        return ServiceImage.objects.filter(service__spot=active_spot)

    @transaction.atomic
    def perform_update(self, serializer):
        instance = self.get_object()
        
        is_primary = serializer.validated_data.get('is_primary', False)

        if is_primary:
            # Demote all other images for this specific service so only ONE is primary
            ServiceImage.objects.filter(
                service=instance.service
            ).exclude(id=instance.id).update(is_primary=False)
        
        serializer.save()

    @transaction.atomic
    def perform_destroy(self, instance):
        service = instance.service
        was_primary = instance.is_primary
        
        instance.delete()

        # If they deleted the primary cover photo, make the next available image the primary cover.
        if was_primary:
            next_image = ServiceImage.objects.filter(service=service).first()
            if next_image:
                next_image.is_primary = True
                next_image.save()