from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from spots.models.spot_member import SpotMember

User = get_user_model()

class UserMinifiedSerializer(serializers.ModelSerializer):
    """Formats minified user details inside the membership payload."""
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'profile_picture']


class SpotMemberReadSerializer(serializers.ModelSerializer):
    """Used for GET operations to return full nested info to the mobile screen."""
    user = UserMinifiedSerializer(read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = SpotMember
        fields = ['id', 'role', 'role_display', 'is_active', 'user']


class SpotMemberWriteSerializer(serializers.ModelSerializer):
    """Used for POST/PATCH operations to process incoming changes via Email."""
    email = serializers.EmailField(write_only=True)

    class Meta:
        model = SpotMember
        fields = ['email', 'role']

    def validate(self, attrs):
        email = attrs.get('email').lower().strip()
        active_spot = getattr(self.context['request'].user.settings, 'active_spot', None)
        
        if not active_spot:
            raise serializers.ValidationError({"detail": _("You do not have an active business spot selected.")})
            
        attrs['active_spot'] = active_spot

        # 🚀 CHANGE HERE: Check if they are already an active member of this spot
        try:
            user = User.objects.get(email=email)
            if SpotMember.objects.filter(spot=active_spot, user=user).exists():
                raise serializers.ValidationError({"email": _("This user is already a member of this spot.")})
        except User.DoesNotExist:
            # This is perfectly fine now! They will be flagged as an un-registered invitee.
            pass

        return attrs

    def create(self, validated_data):
        return SpotMember.objects.create(
            spot=validated_data['active_spot'],
            user=validated_data['user_obj'],
            role=validated_data['role']
        )