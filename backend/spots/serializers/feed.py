from rest_framework import serializers
from spots.models import FeedItem

class FeedItemSerializer(serializers.ModelSerializer):
    spot_name = serializers.CharField(source='spot.name', read_only=True)
    
    class Meta:
        model = FeedItem
        fields = '__all__'
        read_only_fields = ['views', 'created_at']