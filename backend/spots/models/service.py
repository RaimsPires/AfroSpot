from django.db import models
from utils.models import PurchasableItem , BaseModel
from utils.upload import ImageUploadHandler

class Service(PurchasableItem):
    duration_minutes = models.PositiveIntegerField(help_text="Time it takes to complete")
    buffer_minutes = models.PositiveIntegerField(default=0, help_text="Cleanup time between clients")
    
    class Meta:
        ordering = ['created_at']
        db_table = "services"
        
        

class ServiceImage(BaseModel):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to=ImageUploadHandler('services/gallery/'))
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order']
        db_table = "service_images"

    def __str__(self):
        return f"Image for {self.service.name}"