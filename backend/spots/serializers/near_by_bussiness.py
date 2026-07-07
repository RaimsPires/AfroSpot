from rest_framework import serializers
from spots.models import Spot

class NearbyBusinessSerializer(serializers.ModelSerializer):
    distance_km = serializers.FloatField(read_only=True)

    class Meta:
        model = Spot
        # Added 'latitude' and 'longitude' here
        fields = ['id', 'name', 'logo', 'banner_image', 'description', 'distance_km', 'latitude', 'longitude']