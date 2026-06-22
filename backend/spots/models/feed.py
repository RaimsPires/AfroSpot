from django.db import models
from django.conf import settings
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
        
        

# 🚀 NEW: Relational Like Model
class FeedLike(BaseModel):
    feed = models.ForeignKey(FeedItem, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='feed_likes')

    class Meta:
        db_table = "feed_likes"
        unique_together = ('feed', 'user') # Prevents double-liking


class FeedComment(BaseModel):
    feed = models.ForeignKey(FeedItem, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.TextField()
    parent = models.ForeignKey(
        'self', 
        null=True, 
        blank=True, 
        on_delete=models.CASCADE, 
        related_name='replies'
    )

    class Meta:
        db_table = "feed_comments"
        ordering = ['-created_at'] 

# 🚀 NEW: Dedicated Boost Campaign Model
class FeedBoost(BaseModel):
    class BoostStatus(models.TextChoices):
        ACTIVE = 'active', 'Active'
        PAUSED = 'paused', 'Paused'
        COMPLETED = 'completed', 'Completed'

    feed = models.ForeignKey(FeedItem, on_delete=models.CASCADE, related_name='boosts')
    status = models.CharField(max_length=20, choices=BoostStatus.choices, default=BoostStatus.ACTIVE)
    
    # Financials and Targeting
    budget_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    target_audience = models.CharField(max_length=255, blank=True)
    
    # Insights
    reach = models.PositiveIntegerField(default=0, help_text="Number of unique users who saw this via boost")
    link_clicks = models.PositiveIntegerField(default=0)
    
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()

    class Meta:
        db_table = "feed_boosts"