from rest_framework import serializers, viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.db.models import F

from spots.models import FeedItem, FeedViewLog

class FeedItemSerializer(serializers.ModelSerializer):
    spot_name = serializers.CharField(source='spot.name', read_only=True)
    
    class Meta:
        model = FeedItem
        fields = ['id', 'spot', 'spot_name', 'video_file', 'video_cover', 'caption', 'hashtags', 'total_views', 'created_at']
        read_only_fields = ['id', 'total_views', 'created_at']

class FeedViewSet(viewsets.ModelViewSet):
    serializer_class = FeedItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = FeedItem.objects.all().order_by('-created_at')

    def perform_create(self, serializer):
        # Auto-assign the active spot
        serializer.save(spot=self.request.user.settings.active_spot)

    @action(detail=False, methods=['post'])
    def log_views(self, request):
        """
        Receives an array of view data: [{ "feed_id": "123", "duration": 4.5 }, ...]
        """
        logs_data = request.data.get('logs', [])
        
        for log in logs_data:
            feed_id = log.get('feed_id')
            duration = float(log.get('duration', 0))
            
            if feed_id and duration > 0:
                # 1. Create the granular log
                FeedViewLog.objects.create(
                    feed_item_id=feed_id,
                    viewer=request.user if request.user.is_authenticated else None,
                    duration_seconds=duration
                )
                
                # 2. Update the aggregated stats on the FeedItem
                FeedItem.objects.filter(id=feed_id).update(
                    total_views=F('total_views') + 1,
                    total_watch_time_seconds=F('total_watch_time_seconds') + int(duration)
                )

        return Response({"status": "Logs saved successfully"}, status=status.HTTP_200_OK)