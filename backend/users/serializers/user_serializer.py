from rest_framework import serializers
from django.contrib.auth import get_user_model
from .setting_serializer import SettingSerializer
from users.serializers import UserAddressSerializer
from users.models.user_setting import UserSettings
from spots.serializers import UserSpotMembershipSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    settings = SettingSerializer(required=False)
    addresses = UserAddressSerializer(many=True, read_only=True)
    full_name = serializers.SerializerMethodField()
    active_address = serializers.SerializerMethodField()
    active_spot_name = serializers.SerializerMethodField()
    spot_memberships = UserSpotMembershipSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'phone_number', 'dob', 'profile_picture', 'language', 'is_store_owner' , 'is_staff', 'is_active', 'date_joined','settings', 'addresses', 'full_name', 'active_address',"created_at", "updated_at","spot_memberships","active_spot_name"]
        read_only_fields = ['id', 'email','is_staff', 'is_active', 'date_joined','full_name', 'active_address' , 'spot_memberships','active_spot_name']

    def get_full_name(self, obj) -> str:
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_active_address(self, obj) -> str | None:
        active_address = obj.addresses.filter(is_active=True).first()
        return str(active_address) if active_address else None
    def get_active_spot_name(self, obj) -> str | None:
        active_spot = obj.settings.active_spot if hasattr(obj, 'settings') else None
        return active_spot.name if active_spot else None

    def update(self, instance, validated_data):
        settings_data = validated_data.pop('settings', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if settings_data is not None:
            user_settings, _ = UserSettings.objects.get_or_create(user=instance)
            for attr, value in settings_data.items():
                setattr(user_settings, attr, value)
            user_settings.save()

        return instance