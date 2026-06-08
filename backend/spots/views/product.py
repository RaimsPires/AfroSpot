from rest_framework import viewsets , generics
from rest_framework.permissions import IsAuthenticated
from spots.models import Product, ProductImage 
from spots.serializers import ProductSerializer
from rest_framework.permissions import IsAuthenticated
from django.db import transaction

# Adjust these imports based on your actual file structure
from spots.serializers import ProductImageSerializer

class ProductImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles fetching, updating (PATCH), and deleting a specific product image.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ProductImageSerializer

    def get_queryset(self):
        # Swagger schema generation safeguard
        if getattr(self, "swagger_fake_view", False):
            return ProductImage.objects.none()
            
        # Security: Only allow managers to edit images belonging to their active spot
        active_spot = getattr(self.request.user.settings, 'active_spot', None)
        if not active_spot:
            return ProductImage.objects.none()

        # The double underscore `product__spot` spans the ForeignKey 
        # to ensure the image belongs to the manager's active business
        return ProductImage.objects.filter(product__spot=active_spot)

    @transaction.atomic
    def perform_update(self, serializer):
        instance = self.get_object()
        
        # Check if the frontend is trying to set this image as the primary cover
        is_primary = serializer.validated_data.get('is_primary', False)

        if is_primary:
            # Demote all other images for this specific product so only ONE is primary
            ProductImage.objects.filter(
                product=instance.product
            ).exclude(id=instance.id).update(is_primary=False)
        
        # Save the requested update
        serializer.save()

    @transaction.atomic
    def perform_destroy(self, instance):
        product = instance.product
        was_primary = instance.is_primary
        
        # Delete the requested image
        instance.delete()

        # Fallback Logic: If they deleted the primary cover photo, 
        # find the next available image and make it the primary cover automatically.
        if was_primary:
            next_image = ProductImage.objects.filter(product=product).first()
            if next_image:
                next_image.is_primary = True
                next_image.save()
                
class ProductViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Product.objects.none()
            
        active_spot = getattr(self.request.user.settings, 'active_spot', None)
        if not active_spot:
            return Product.objects.none()
            
        return Product.objects.filter(spot=active_spot).order_by('-id')