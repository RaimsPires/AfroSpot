from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.conf import settings
from importlib import import_module

User = get_user_model()


def get_email_verification_model():
    """Get the EmailVerification model from auth_kit"""
    try:
        from auth_kit.models import EmailVerification
        return EmailVerification
    except ImportError:
        raise serializers.ValidationError(
            "Email verification is not properly configured. Please contact support."
        )


class VerifyBusinessRegistrationEmailSerializer(serializers.Serializer):
    """
    Serializer for verifying email during business registration.
    Validates the email verification key and activates the user account.
    """
    key = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)

    def validate(self, attrs):
        """
        Validate that the key is correct for the given email.
        """
        key = attrs.get('key')
        email = attrs.get('email').lower().strip()

        # Get the EmailVerification model
        EmailVerification = get_email_verification_model()

        # Try to find a valid email verification record
        try:
            email_verification = EmailVerification.objects.get(
                key=key,
                email=email,
                verified=False  # Not yet verified
            )
        except EmailVerification.DoesNotExist:
            raise serializers.ValidationError(
                {
                    "key": "Invalid or expired verification key. Please request a new verification email."
                }
            )

        attrs['email_verification'] = email_verification
        return attrs

    def save(self):
        """
        Mark the email as verified and activate the user account.
        Returns the activated user.
        """
        email_verification = self.validated_data['email_verification']
        email = self.validated_data['email']

        # Mark as verified
        email_verification.verified = True
        email_verification.save()

        # Find and activate the user
        try:
            user = User.objects.get(email=email)
            user.is_active = True
            user.save()
            return user
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "User account not found. Please contact support."}
            )
