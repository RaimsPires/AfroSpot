from django.db import models
from django.utils.translation import gettext_lazy as _

from utils.models.models import BaseModel
from spots.models.spot import Spot

class OperatingHours(BaseModel):
    """
    Defines the daily schedule for the spot.
    """
    class DayOfWeek(models.IntegerChoices):
        MONDAY = 1, _('Monday')
        TUESDAY = 2, _('Tuesday')
        WEDNESDAY = 3, _('Wednesday')
        THURSDAY = 4, _('Thursday')
        FRIDAY = 5, _('Friday')
        SATURDAY = 6, _('Saturday')
        SUNDAY = 7, _('Sunday')

    spot = models.ForeignKey(Spot, on_delete=models.CASCADE, related_name='operating_hours')
    day = models.IntegerField(choices=DayOfWeek.choices)
    
    is_closed = models.BooleanField(default=False)
    
    open_time = models.TimeField(null=True, blank=True)
    close_time = models.TimeField(null=True, blank=True)

    class Meta:
        unique_together = ('spot', 'day') # A spot can only have one schedule per day
        ordering = ['day']
        db_table = "operating_hours"

    def __str__(self):
        return f"{self.spot.name} - {self.get_day_display()}"