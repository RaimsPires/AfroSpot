import uuid

from django.db import models
from django.utils import timezone
from utils.managers import SoftDeleteManager

class BaseModel(models.Model):
    """
    Abstract base model that provides self-updating 'created_at' and 'updated_at' fields,
    along with soft-delete capabilities.
    """
    
    id =  models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Update Tracking Fields
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Soft Delete Fields
    is_deleted = models.BooleanField(default=False, db_index=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    # Assign the custom manager
    objects = SoftDeleteManager()

    class Meta:
        abstract = True  # Tells Django not to create a table for this model
        ordering = ['-created_at']

    def delete(self, hard=False, *args, **kwargs):
        """
        Override the default delete method.
        Usage: 
            instance.delete() -> Soft deletes
            instance.delete(hard=True) -> Permanently deletes from database
        """
        if hard:
            super().delete(*args, **kwargs)
        else:
            self.is_deleted = True
            self.deleted_at = timezone.now()
            self.save(update_fields=['is_deleted', 'deleted_at'])

    def restore(self):
        """
        Restores a soft-deleted object.
        """
        self.is_deleted = False
        self.deleted_at = None
        self.save(update_fields=['is_deleted', 'deleted_at'])