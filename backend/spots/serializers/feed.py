from rest_framework import serializers
from spots.models.feed import FeedItem, FeedComment

class FeedCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    # user_avatar = serializers.ImageField(source='user.profile_picture', read_only=True) # Optional
    
    class Meta:
        model = FeedComment
        fields = ['id', 'user', 'user_name', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class FeedCommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = FeedComment
        fields = ['id', 'user', 'user_name', 'user_username', 'text', 'parent', 'replies', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

    def get_replies(self, obj):
        # Check if the comment has replies. 
        # We only nest one level deep to avoid infinite loops and massive payloads.
        if obj.replies.exists():
            # We reuse the same serializer for the replies
            return FeedCommentSerializer(obj.replies.all(), many=True).data
        return []

class FeedItemSerializer(serializers.ModelSerializer):
    spot_name = serializers.CharField(source='spot.name', read_only=True)
    
    # 🚀 Pull the annotated fields from the view's queryset
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    is_boosted = serializers.BooleanField(read_only=True)
    
    # Get the latest active boost reach (Optional, requires a SerializerMethodField)
    boost_reach = serializers.SerializerMethodField()

    class Meta:
        model = FeedItem
        fields = [
            'id', 'spot', 'spot_name', 'video_file', 'video_cover', 'caption', 
            'hashtags', 'total_views', 'likes_count', 'comments_count', 
            'is_boosted', 'boost_reach', 'created_at'
        ]
        read_only_fields = ['id', 'spot', 'total_views', 'created_at']

    def get_boost_reach(self, obj):
        # Find the most recent active boost to display its reach
        active_boost = obj.boosts.filter(status='active').first()
        if active_boost:
            return active_boost.reach
        return 0