from django.contrib.auth import get_user_model
from drf_spectacular.utils import OpenApiParameter, extend_schema, inline_serializer
from rest_framework import serializers
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

User = get_user_model()


class CheckEmailView(APIView):
    """
    GET /api/auth/check-email/?email=user@example.com

    Returns { "available": true } if no account exists with that email,
    or { "available": false } if the email is already registered.
    No authentication required.
    """
    permission_classes = [AllowAny]

    @extend_schema(
        parameters=[
            OpenApiParameter(
                name='email',
                type=str,
                location=OpenApiParameter.QUERY,
                required=True,
                description='Email address to check for availability.',
            )
        ],
        responses=inline_serializer(
            name='EmailCheckResponse',
            fields={'available': serializers.BooleanField()},
        ),
    )
    def get(self, request: Request) -> Response:
        email = request.query_params.get('email', '').strip().lower()
        if not email:
            return Response({'available': False, 'error': 'No email provided.'}, status=400)

        exists = User.objects.filter(email__iexact=email).exists()
        return Response({'available': not exists})
