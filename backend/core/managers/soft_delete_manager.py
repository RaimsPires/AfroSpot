from django.db import models
from django.utils import timezone


class SoftDeleteQuerySet(models.QuerySet):
    """
    Custom QuerySet to handle bulk soft-deletes.
    """
    def delete(self, hard=False):
        if hard:
            # Perform a real, hard delete
            return super().delete()
        # Perform a soft delete for the entire queryset
        return super().update(is_deleted=True, deleted_at=timezone.now())

    def alive(self):
        """Return only non-deleted objects."""
        return self.filter(is_deleted=False)

    def dead(self):
        """Return only deleted objects."""
        return self.filter(is_deleted=True)
    


class SoftDeleteManager(models.Manager):
    """
    Custom Manager that hides soft-deleted objects by default.
    """
    def get_queryset(self):
        # By default, Model.objects.all() will only return items that are NOT deleted
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=False)

    def all_with_deleted(self):
        # Use Model.objects.all_with_deleted() to see everything
        return SoftDeleteQuerySet(self.model, using=self._db)

    def deleted_only(self):
        # Use Model.objects.deleted_only() to see only trashed items
        return SoftDeleteQuerySet(self.model, using=self._db).filter(is_deleted=True)