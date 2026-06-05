from rest_framework import serializers
from datetime import datetime
from django.utils.translation import gettext_lazy as _
from spots.models.operating_hours import OperatingHours

class OperatingHoursSerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source='get_day_display', read_only=True)
    
    open_time = serializers.TimeField(format='%H:%M', input_formats=['%H:%M', '%H:%M:%S'])
    close_time = serializers.TimeField(format='%H:%M', input_formats=['%H:%M', '%H:%M:%S'])

    class Meta:
        model = OperatingHours
        fields = ['id', 'day', 'day_display', 'is_closed', 'open_time', 'close_time']

    def validate(self, attrs):
        is_closed = attrs.get('is_closed', False)
        open_time = attrs.get('open_time')
        close_time = attrs.get('close_time')

        if not is_closed:
            if not open_time or not close_time:
                raise serializers.ValidationError(_("Open and close times are required if the spot is open."))
            if open_time >= close_time:
                raise serializers.ValidationError(_("Closing time must be after opening time."))
        else:
            # Clean up times if marked closed
            attrs['open_time'] = None
            attrs['close_time'] = None
            
        return attrs