from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from users.serializers import VerifyCredentialsSerializer
from drf_spectacular.utils import extend_schema

# class VerifyCredentialsResponseSerializer(serializers.Serializer):
#     message = serializers.CharField(default="Credentials are valid.")
#     user_id = serializers.IntegerField()

class VerifyCredentialsView(APIView):
    """
    Takes a login_id (email or phone) and a password.
    Returns the user ID if the credentials are valid.
    """
    permission_classes = [AllowAny]
    serializer_class = VerifyCredentialsSerializer
    
    @extend_schema(
        request=VerifyCredentialsSerializer,
        # summary="Verify User Credentials",
        # description="Takes a login_id (email or phone) and a password to verify user credentials."
        responses={200: VerifyCredentialsSerializer}
    )
    def post(self, request, *args, **kwargs):
        # 1. Pass the data and the request context to the serializer
        serializer = VerifyCredentialsSerializer(
            data=request.data, 
            context={'request': request}
        )
        
        # 2. This single line triggers the validate() method in the serializer.
        # If the password is wrong, it instantly stops and returns a 400 error.
        serializer.is_valid(raise_exception=True)
        
        # 3. If we reach here, credentials are 100% valid. Extract the user.
        user = serializer.validated_data['user']

        return Response(
            {
                "message": "Credentials are valid.",
                "user_id": user.id
            },
            status=status.HTTP_200_OK
        )