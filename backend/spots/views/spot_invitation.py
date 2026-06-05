from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from spots.models.spot_invitation import SpotInvitation
from spots.serializers import SpotInvitationSerializer

@extend_schema_view(
    retrieve=extend_schema(parameters=[OpenApiParameter("id", OpenApiTypes.STR, OpenApiParameter.PATH)]),
    update=extend_schema(parameters=[OpenApiParameter("id", OpenApiTypes.STR, OpenApiParameter.PATH)]),
    partial_update=extend_schema(parameters=[OpenApiParameter("id", OpenApiTypes.STR, OpenApiParameter.PATH)]),
    destroy=extend_schema(parameters=[OpenApiParameter("id", OpenApiTypes.STR, OpenApiParameter.PATH)]),
)
class SpotInvitationViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SpotInvitationSerializer
    lookup_field = 'id'
    # lookup_field = 'token'
    
    filter_backends = [DjangoFilterBackend] # Note: double check it's 'filter_backends', not 'backend_filters'
    filterset_fields = ['status']

    def get_queryset(self):
        # 🚀 1. Check if this is drf-spectacular generating documentation
        if getattr(self, "swagger_fake_view", False):
            return SpotInvitation.objects.none()

        # 🚀 2. Double safeguard check for anonymous access safety profiles
        if not self.request.user or self.request.user.is_anonymous:
            return SpotInvitation.objects.none()

        # Your normal operating logic continues perfectly safe now:
        active_spot = getattr(self.request.user.settings, 'active_spot', None)
        if not active_spot:
            return SpotInvitation.objects.none()
            
        return SpotInvitation.objects.filter(spot=active_spot)