import uuid

from django.db import models
from django.utils import timezone
from utils.managers import SoftDeleteManager
from django.utils.text import slugify

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
        
        
    def save(self, *args, **kwargs):
        # 1. Check if the child model actually has a 'slug' field, and if it's currently empty
        if hasattr(self, 'slug') and not self.slug:
            
            # 2. Figure out which field to generate the slug from
            # First, check if the child model explicitly defined 'slug_source_field'
            source_field = getattr(self, 'slug_source_field', None)
            
            # If not, smartly fallback to common naming conventions
            if not source_field:
                if hasattr(self, 'title'):
                    source_field = 'title'
                elif hasattr(self, 'name'):
                    source_field = 'name'
            
            # 3. If we found a valid source field, generate the slug
            if source_field and hasattr(self, source_field):
                source_text = getattr(self, source_field)
                base_slug = slugify(source_text)
                slug = base_slug
                
                # 4. Check for collisions using the child's specific database table
                # self.__class__ dynamically refers to the specific child model (e.g., Event or Spot)
                ModelClass = self.__class__
                
                while ModelClass.objects.filter(slug=slug).exists():
                    random_suffix = uuid.uuid4().hex[:4]
                    slug = f"{base_slug}-{random_suffix}"
                
                # 5. Assign the safe slug
                self.slug = slug
                
        # Finally, call the real save method
        super().save(*args, **kwargs)

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