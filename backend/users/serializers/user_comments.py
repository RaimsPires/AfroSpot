from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserCommentSerializer(serializers.ModelSerializer):
    short_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['profile_picture', 'short_name',"id"]
        
    def get_short_name(self,obj):
        return obj.get_short_name