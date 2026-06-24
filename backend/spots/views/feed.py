from django.db.models import Sum, Count, Exists, OuterRef
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from spots.models import FeedItem, FeedLike, FeedComment, FeedBoost
from spots.serializers import FeedItemSerializer, FeedCommentSerializer , FeedLikeSerializer
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

    # 🚀 ACTION: Add a Comment
    @action(detail=True, methods=['post'])
    def add_comment(self, request, pk=None):
        feed = self.get_object()
        text = request.data.get('text')
        parent_id = request.data.get('parent_id')
        
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
    
    # 🚀 ACTION: Get Paginated Likes
    @action(detail=True, methods=['get'])
    def likes(self, request, pk=None):
        feed = self.get_object()
        likes_qs = FeedLike.objects.filter(feed=feed).select_related('user').order_by('-created_at')
        
        page = self.paginate_queryset(likes_qs)
        if page is not None:
            # Pass the request context for absolute URLs in the avatar
            serializer = FeedLikeSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)
            
        serializer = FeedLikeSerializer(likes_qs, many=True, context={'request': request})
        return Response(serializer.data)

    # 🚀 ACTION: Toggle Like (POST Only)
    @action(detail=True, methods=['post'])
    def toggle_like(self, request, pk=None):
        feed = self.get_object()
        
        # Toggle logic: Create if not exists, delete if exists
        like, created = FeedLike.objects.get_or_create(feed=feed, user=request.user)
        
        if not created:
            like.delete()
            return Response({"status": "unliked", "is_liked": False}, status=status.HTTP_200_OK)
            
        return Response({"status": "liked", "is_liked": True}, status=status.HTTP_201_CREATED)

    # 🚀 GET all comments for this specific feed
    @action(detail=True, methods=['get'])
    def comments(self, request, pk=None):
        feed = self.get_object()
        # Only paginate top-level comments (replies are nested inside)
        comments = FeedComment.objects.filter(feed=feed, parent__isnull=True).select_related('user')
        
        page = self.paginate_queryset(comments)
        if page is not None:
            serializer = FeedCommentSerializer(page, many=True,context={'request': request})
            return self.get_paginated_response(serializer.data)
            
        serializer = FeedCommentSerializer(comments, many=True,context={'request': request})
        return Response(serializer.data)
    
    
    @action(detail=True, methods=['get'], url_path='comments/(?P<comment_id>[^/.]+)/replies')
    def comment_replies(self, request, pk=None, comment_id=None):
        """
        Fetches paginated replies for a specific top-level comment.
        URL: /api/feeds/<feed_id>/comments/<comment_id>/replies/?offset=2&limit=10
        """
        feed = self.get_object()
        
        try:
            # Ensure the parent comment belongs to this feed
            parent_comment = FeedComment.objects.get(id=comment_id, feed=feed)
        except FeedComment.DoesNotExist:
            return Response({"detail": "Comment not found."}, status=404)

        # Get pagination parameters from the query string (defaults to offset 0, limit 10)
        try:
            offset = int(request.query_params.get('offset', 0))
            limit = int(request.query_params.get('limit', 10))
        except ValueError:
            return Response({"detail": "Invalid offset or limit"}, status=400)
        
        # Fetch the replies ordered by creation time
        replies_qs = FeedComment.objects.filter(
            parent=parent_comment
        ).select_related('user').order_by('created_at')
        
        # Slice the queryset
        replies = replies_qs[offset:offset + limit]
        
        # Pass a context flag to prevent infinite nesting in the serializer
        serializer = FeedCommentSerializer(
            replies, 
            many=True, 
            context={'request': request, 'is_reply_fetch': True}
        )
        
        return Response({
            'results': serializer.data,
            'next_offset': offset + limit if (offset + limit) < replies_qs.count() else None
        })