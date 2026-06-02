from django.db import models
from django.utils.translation import gettext_lazy as _
from utils.models.models import BaseModel
from utils.upload import ImageUploadHandler  
from spots.models.spot import Spot

# Assuming BaseModel and Spot are imported from your other files
# from core.models import BaseModel
# from spots.models import Spot

class Event(BaseModel):
    class EventType(models.TextChoices):
        PHYSICAL = 'physical', _('Physical Event')
        VIRTUAL = 'virtual', _('Virtual / Online')
        HYBRID = 'hybrid', _('Hybrid (Physical & Virtual)')

    class EventStatus(models.TextChoices):
        DRAFT = 'draft', _('Draft')
        PUBLISHED = 'published', _('Published & Active')
        CANCELLED = 'cancelled', _('Cancelled')
        COMPLETED = 'completed', _('Completed')

    spot = models.ForeignKey(Spot, on_delete=models.CASCADE, related_name='events')
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    
    # Using your universal image path generator!
    banner_image = models.ImageField(
        upload_to=ImageUploadHandler('spots/events/'),
        null=True, blank=True
    )

    # Date & Time (Timezone aware)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    
    event_type = models.CharField(max_length=20, choices=EventType.choices, default=EventType.PHYSICAL)
    status = models.CharField(max_length=20, choices=EventStatus.choices, default=EventStatus.DRAFT)

    # Location Overrides (In case the event is NOT at the actual Spot's address)
    is_at_spot_location = models.BooleanField(default=True, help_text=_("Uncheck if hosting at a different venue"))
    custom_address = models.CharField(max_length=255, blank=True)
    virtual_link = models.URLField(blank=True, help_text=_("Link for virtual events (e.g., Zoom, Google Meet)"))

    def __str__(self):
        return f"{self.title} @ {self.spot.name}"





