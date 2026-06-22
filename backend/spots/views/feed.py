from django.db.models import Sum, Count, Exists, OuterRef
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from spots.models import FeedItem, FeedLike, FeedComment, FeedBoost
from spots.serializers import FeedItemSerializer, FeedCommentSerializer
from utils.pagination import StandardResultsSetPagination

class FeedViewSet(viewsets.ModelViewSet):
    serializer_class = FeedItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        # 1. Annotate counts directly in the database query for performance
        queryset = FeedItem.objects.annotate(
            likes_count=Count('likes', distinct=True),
            comments_count=Count('comments', distinct=True)
        ).order_by('-created_at')

        # 2. Add 'is_boosted' and 'boost_reach' dynamically based on active campaigns
        active_boosts = FeedBoost.objects.filter(
            feed=OuterRef('pk'), 
            status=FeedBoost.BoostStatus.ACTIVE
        )
        
        queryset = queryset.annotate(
            is_boosted=Exists(active_boosts),
        )

        # 3. Manager filtering
        active_spot = getattr(self.request.user.settings, 'active_spot', None)
        if active_spot:
            queryset = queryset.filter(spot=active_spot)

        # 4. Tab Filtering
        tab = self.request.query_params.get('tab', 'All')
        if tab == 'Boosted':
            queryset = queryset.filter(is_boosted=True)
        elif tab == 'Organic':
            queryset = queryset.filter(is_boosted=False)

        return queryset

    def perform_create(self, serializer):
        active_spot = getattr(self.request.user.settings, 'active_spot', None)
        serializer.save(spot=active_spot)



    @action(detail=False, methods=['get'])
    def spot_stats(self, request):
        """
        Fetches the total views, likes, and reach for the active spot.
        Fires once on page load.
        """
        active_spot = getattr(request.user.settings, 'active_spot', None)
        if not active_spot:
            return Response({"total_views": 0, "total_likes": 0, "total_reach": 0})

        # 1. Sum of all views across all feeds for this spot
        feeds = FeedItem.objects.filter(spot=active_spot)
        total_views = feeds.aggregate(total=Sum('total_views'))['total'] or 0

        # 2. Count of all likes across all feeds for this spot
        total_likes = FeedLike.objects.filter(feed__spot=active_spot).count()

        # 3. Sum of all reach from all boosts for this spot
        total_reach = FeedBoost.objects.filter(feed__spot=active_spot).aggregate(total=Sum('reach'))['total'] or 0

        return Response({
            "total_views": total_views,
            "total_likes": total_likes,
            "total_reach": total_reach
        })
        
    @action(detail=True, methods=['post'])
    def toggle_like(self, request, pk=None):
        feed = self.get_object()
        like, created = FeedLike.objects.get_or_create(feed=feed, user=request.user)
        
        if not created:
            # If it already existed, they are unliking it
            like.delete()
            return Response({"status": "unliked", "likes_count": feed.likes.count()})
            
        return Response({"status": "liked", "likes_count": feed.likes.count()})

    # 🚀 ACTION: Add a Comment
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        feed = self.get_object()
        text = request.data.get('text')
        parent_id = request.data.get('parent_id') # 🚀 Extract parent_id if it exists
        
        if not text:
            return Response({"error": "Comment text is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        parent_comment = None
        if parent_id:
            try:
                # 🚀 Ensure the parent comment exists and belongs to the exact same feed
                parent_comment = FeedComment.objects.get(id=parent_id, feed=feed)
            except FeedComment.DoesNotExist:
                return Response({"error": "Parent comment not found."}, status=status.HTTP_404_NOT_FOUND)
            
        # 🚀 Create the comment, optionally attaching the parent
        comment = FeedComment.objects.create(
            feed=feed, 
            user=request.user, 
            text=text,
            parent=parent_comment
        )
        
        serializer = FeedCommentSerializer(comment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    # 🚀 GET all likes for this specific feed
    @action(detail=True, methods=['get'])
    def likes(self, request, pk=None):
        feed = self.get_object()
        likes = FeedLike.objects.filter(feed=feed).select_related('user')
        
        page = self.paginate_queryset(likes)
        
        def serialize_likes(queryset):
            return [{
                "id": str(like.id),
                "name": like.user.get_full_name(),
                "username": like.user.username,
                "avatar": like.user.profile_picture.url if hasattr(like.user, 'profile_picture') and like.user.profile_picture else None
            } for like in queryset]

        if page is not None:
            return self.get_paginated_response(serialize_likes(page))
            
        return Response(serialize_likes(likes))

    # 🚀 GET all comments for this specific feed
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        feed = self.get_object()
        # Only paginate top-level comments (replies are nested inside)
        comments = FeedComment.objects.filter(feed=feed, parent__isnull=True).select_related('user')
        
        page = self.paginate_queryset(comments)
        if page is not None:
            serializer = FeedCommentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = FeedCommentSerializer(comments, many=True)
        return Response(serializer.data)