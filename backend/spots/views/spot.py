from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from spots.models.spot import Spot
from spots.serializers import SpotSerializer

class ActiveSpotView(generics.RetrieveUpdateAPIView):
    """
    Retrieves and updates the currently active Spot profile 
    for the authenticated manager/owner.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SpotSerializer

    def get_object(self):
        # Swagger safeguard
        if getattr(self, "swagger_fake_view", False):
            return Spot.objects.none()
            
        # Get the active spot bound to the user's session settings
        active_spot = getattr(self.request.user.settings, 'active_spot', None)
        return active_spot