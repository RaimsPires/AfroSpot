from rest_framework import viewsets, filters, pagination
from django_filters.rest_framework import DjangoFilterBackend
from spots.models import Event
from spots.serializers import EventSerializer # Make sure you have an EventSerializer created
from django.utils import timezone
from rest_framework.permissions import IsAuthenticatedOrReadOnly

# 1. Custom Pagination Class
class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

# 2. The ViewSet
class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    # Enable searching and filtering
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    
    # What fields can the user search by typing in the search bar?
    search_fields = ['title', 'description', 'spot__name', 'custom_address']
    
    # What exact fields can they filter by?
    filterset_fields = ['status', 'event_type']

    def get_queryset(self):
        # 1. Base Query
        queryset = Event.objects.all().order_by('start_datetime')

        # 2. Check if this is a "Detail" request (fetching a single object)
        # If 'pk' is in kwargs, we are likely doing a retrieve/update/delete
        if self.kwargs.get('pk'):
            # Return all events, but still keep spot-based security if you want to be strict
            return queryset

        # 3. List View Logic (only runs if it's a list request)
        my_events = self.request.query_params.get('my_events')
        if my_events == 'true' and self.request.user.is_authenticated:
            active_spot = getattr(self.request.user.settings, 'active_spot', None)
            if active_spot:
                queryset = queryset.filter(spot=active_spot)
            else:
                return Event.objects.none()
        else:
            # Attendee view: Only show published events
            queryset = queryset.filter(status=Event.EventStatus.PUBLISHED)

        # 4. Upcoming vs Past logic
        time_filter = self.request.query_params.get('time')
        today = timezone.now().date()
        if time_filter == 'upcoming':
            queryset = queryset.filter(end_datetime__date__gte=today)
        elif time_filter == 'past':
            queryset = queryset.filter(end_datetime__date__lt=today)

        return queryset