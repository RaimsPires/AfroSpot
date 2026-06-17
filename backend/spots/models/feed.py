from django.db import models
from django.utils.translation import gettext_lazy as _
from utils.models.models import BaseModel
from utils.upload import VideoUploadHandler,ImageUploadHandler
from spots.models.spot import Spot

class FeedItem(BaseModel):
    spot = models.ForeignKey(Spot, on_delete=models.CASCADE, related_name='feed_items')
    video_file = models.FileField(upload_to=VideoUploadHandler('spots/feed/videos/'))
    video_cover = models.ImageField(upload_to=ImageUploadHandler('spots/feed/covers/'), null=True, blank=True)
    caption = models.TextField(blank=True)
    hashtags = models.CharField(max_length=500, blank=True)
    
    # Aggregated Analytics
    total_views = models.PositiveIntegerField(default=0)
    total_watch_time_seconds = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "feed_items"
        ordering = ['-created_at']

class FeedViewLog(BaseModel):
    """Stores granular, event-driven view logs flushed from the mobile app."""
    feed_item = models.ForeignKey(FeedItem, on_delete=models.CASCADE, related_name='view_logs')
    # If the user is logged in, link them. Otherwise, null.
    viewer = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    duration_seconds = models.FloatField(default=0.0)

    class Meta:
        db_table = "feed_view_logs"