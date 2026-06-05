from rest_framework import serializers
from spots.models.spot import Spot
from spots.models.spot_member import SpotMember

class SpotMinifiedSerializer(serializers.ModelSerializer):
    """Returns basic details of the business/spot."""
    class Meta:
        model = Spot
        fields = ['id', 'name', 'slug', 'logo', 'is_verified', 'is_active',"email","phone_number"]

class UserSpotMembershipSerializer(serializers.ModelSerializer):
    """Bridges the membership data, pulling the specific spot information."""
    spot = SpotMinifiedSerializer(read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = SpotMember
        fields = ['id', 'spot', 'role', 'role_display', 'is_active']