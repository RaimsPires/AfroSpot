import os
import uuid
from django.utils.deconstruct import deconstructible

@deconstructible
class ImageUploadHandler:
    """
    Generates a secure, UUID-based file path.
    Compatible with Django migrations and dynamic instance attributes.
    """
    def __init__(self, path_template):
        # We store the template string (e.g., 'shops/{instance.slug}/logos')
        self.path_template = path_template

    def __call__(self, instance, filename):
        # 1. Secure the file extension
        ext = filename.split('.')[-1].lower()
        
        # 2. Generate a secure, randomized filename
        new_filename = f"{uuid.uuid4()}.{ext}"
        
        # 3. Format the folder path using the instance's data
        try:
            formatted_path = self.path_template.format(instance=instance)
        except (AttributeError, KeyError):
            # Fallback in case the instance hasn't been fully saved 
            # and is missing an ID or Slug
            formatted_path = self.path_template.split('/{')[0] + '/unassigned'

        # 4. Return the final path
        return os.path.join(formatted_path, new_filename)
    
    
@deconstructible
class VideoUploadHandler:
    """
    Generates a secure, UUID-based file path specifically for videos.
    Compatible with Django migrations and dynamic instance attributes.
    """
    def __init__(self, path_template):
        # Store the template string (e.g., 'spots/{instance.spot.id}/videos/')
        self.path_template = path_template

    def __call__(self, instance, filename):
        # 1. Secure the file extension
        ext = filename.split('.')[-1].lower()
        
        # 2. Generate a secure, randomized filename
        new_filename = f"{uuid.uuid4()}.{ext}"
        
        # 3. Format the folder path using the instance's data
        try:
            formatted_path = self.path_template.format(instance=instance)
        except (AttributeError, KeyError):
            # Fallback in case the instance hasn't been fully saved 
            # and is missing related data (like a spot ID)
            # Safely grab the base directory before the format string
            base_dir = self.path_template.split('/{')[0]
            formatted_path = f"{base_dir}/unassigned_videos"

        # 4. Return the final path
        return os.path.join(formatted_path, new_filename)