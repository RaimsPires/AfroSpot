from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from spots.serializers import RegisterAllSerializer

class RegisterAllView(GenericAPIView):
    """
    Unified registration endpoint.
    Accepts user details (or user_id) alongside business metadata to form accounts instantly.
    """
    permission_classes = [AllowAny]
    serializer_class = RegisterAllSerializer

    def post(self, request, *args, **kwargs):
        # multipart/form-data is read transparently by the parser context
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user, spot = serializer.save()

        return Response(
            {
                "message": "Registration processed successfully.",
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "is_client": user.is_client,
                    "is_store_owner": user.is_store_owner,
                },
                "spot": {
                    "id": spot.id,
                    "name": spot.name,
                    "slug": spot.slug
                }
            },
            status=status.HTTP_201_CREATED
        )