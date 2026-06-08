from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from spots.models import Product
from spots.serializers import ProductSerializer

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