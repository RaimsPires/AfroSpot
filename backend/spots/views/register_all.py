from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from spots.serializers import RegisterAllSerializer

class RegisterAllView(GenericAPIView):
    """
    Unified registration endpoint.
    Accepts user details (or user_id) alongside business metadata to form accounts instantly.
    
    Response includes registration metadata:
    - is_new_user: Boolean indicating if a new user account was created
    - is_existing_user: Boolean indicating if an existing user created a new business
    - requires_email_verification: Boolean indicating if user must verify email before login
    """
    permission_classes = [AllowAny]
    serializer_class = RegisterAllSerializer

    def post(self, request, *args, **kwargs):
        # multipart/form-data is read transparently by the parser context
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user, spot, is_new_user = serializer.save()
        is_existing_user = not is_new_user

        return Response(
            {
                "message": "Registration processed successfully.",
                "is_new_user": is_new_user,
                "is_existing_user": is_existing_user,
                "requires_email_verification": is_new_user,  # Only new users need email verification
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "is_client": user.is_client,
                    "is_store_owner": user.is_store_owner,
                    "is_active": user.is_active,  # False for new users until verified
                },
                "spot": {
                    "id": spot.id,
                    "name": spot.name,
                    "slug": spot.slug
                }
            },
            status=status.HTTP_201_CREATED
        )