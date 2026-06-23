from rest_framework import serializers
from spots.models.feed import FeedItem, FeedComment
from users.serializers import UserCommentSerializer

class FeedCommentSerializer(serializers.ModelSerializer):
    user = UserCommentSerializer(read_only=True)    
    class Meta:
        model = FeedComment
        fields = ['id', 'user', 'user_name', 'text', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

class FeedCommentSerializer(serializers.ModelSerializer):
    user = UserCommentSerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    reply_count = serializers.SerializerMethodField()

    class Meta:
        model = FeedComment
        fields = ['id', 'user', 'text', 'parent', 'replies','reply_count']
        read_only_fields = ['id', 'user', 'created_at','avatar']
        
    def get_avatar(self,obj):
        return f"{obj.user.profile_picture}"

    def get_replies(self, obj):
        # If we are explicitly fetching replies via the new endpoint, don't nest further
        if obj.parent_id is not None or self.context.get('is_reply_fetch'):
            return []
            
        # For top-level comments, only load the first 2 replies initially
        initial_replies = FeedComment.objects.filter(
            parent=obj
        ).select_related('user').order_by('created_at')[:2]
        
        return FeedCommentSerializer(
            initial_replies, 
            many=True, 
            context={'request': self.context.get('request'), 'is_reply_fetch': True}
        ).data
    
    def get_reply_count(self, obj):
        if obj.parent_id is not None:
            return 0
        return FeedComment.objects.filter(parent=obj).count()

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