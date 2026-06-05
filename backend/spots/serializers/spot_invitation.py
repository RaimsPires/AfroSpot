from rest_framework import serializers
from spots.models.spot_invitation import SpotInvitation

class SpotInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotInvitation
        fields = ['id', 'email', 'role', 'status', 'created_at', 'expires_at']