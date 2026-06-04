from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from spots.serializers.verify_business_email import VerifyBusinessRegistrationEmailSerializer


class VerifyBusinessRegistrationEmailView(GenericAPIView):
    """
    API endpoint to verify email during business registration.
    
    Accepts a verification key and email address, validates the key,
    and activates the user account if valid.
    
    Request:
        POST /api/spots/verify-registration-email/
        {
            "key": "verification-key-from-email",
            "email": "user@example.com"
        }
    
    Response (200 OK):
        {
            "message": "Email verified successfully. You can now log in.",
            "user": {
                "id": 123,
                "email": "user@example.com",
                "is_active": true
            }
        }
    
    Response (400 Bad Request):
        {
            "key": "Invalid or expired verification key..."
        }
    """
    permission_classes = [AllowAny]
    serializer_class = VerifyBusinessRegistrationEmailSerializer

    def post(self, request, *args, **kwargs):
        """
        Verify the email and activate the user account.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            {
                "message": "Email verified successfully. You can now log in.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "is_active": user.is_active,
                }
            },
            status=status.HTTP_200_OK,
        )
