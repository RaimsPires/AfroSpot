
from rest_framework import serializers
from users.models.setting import UserSettings
from users.models import UserSettings

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = "__all__"
        read_only_fields = ['id', 'user']