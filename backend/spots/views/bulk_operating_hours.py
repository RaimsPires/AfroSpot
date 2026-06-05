from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from drf_spectacular.utils import extend_schema
from spots.models.operating_hours import OperatingHours
from spots.serializers import OperatingHoursSerializer

class BulkOperatingHoursView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = OperatingHoursSerializer

    @extend_schema(
        summary="Fetch operating hours matrix",
        responses={200: OperatingHoursSerializer(many=True)}
    )
    def get(self, request, *args, **kwargs):
        """Fetch the schedule list for the user's active business spot."""
        # This assumes your authentication layer or user profile links to an active_spot
        active_spot = getattr(request.user.settings, 'active_spot', None)
        if not active_spot:
            return Response({"error": "No active spot selected for this user profile."}, status=status.HTTP_400_BAD_REQUEST)

        hours = OperatingHours.objects.filter(spot=active_spot).order_by('day')
        serializer = OperatingHoursSerializer(hours, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @extend_schema(
        summary="Bulk upsert operating hours",
        request=OperatingHoursSerializer(many=True),
        responses={200: OperatingHoursSerializer(many=True)}
    )
    def post(self, request, *args, **kwargs):
        active_spot = getattr(request.user.settings, 'active_spot', None)
        if not active_spot:
            return Response({"error": "No active spot assigned."}, status=status.HTTP_400_BAD_REQUEST)

        schedules_data = request.data
        if not isinstance(schedules_data, list):
            schedules_data = [schedules_data]

        saved_objects = []

        # Secure all database writes inside an atomic transaction block
        with transaction.atomic():
            for schedule in schedules_data:
                day_value = schedule.get('day')
                is_closed = schedule.get('is_closed', False)
                
                # Perform an atomic upsert 
                hours_obj, created = OperatingHours.objects.update_or_create(
                    spot=active_spot,
                    day=day_value,
                    defaults={
                        'is_closed': is_closed,
                        'open_time': None if is_closed else schedule.get('open_time'),
                        'close_time': None if is_closed else schedule.get('close_time'),
                    }
                )
                saved_objects.append(hours_obj)

        response_serializer = OperatingHoursSerializer(saved_objects, many=True)
        return Response(response_serializer.data, status=status.HTTP_200_OK)