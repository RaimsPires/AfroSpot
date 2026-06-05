from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from spots.models.spot_member import SpotMember
from spots.serializers import SpotMemberReadSerializer, SpotMemberWriteSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth import get_user_model
from django.db import transaction
from django.conf import settings

from spots.models.spot_member import SpotMember
from spots.models.spot_invitation import SpotInvitation
from spots.serializers import SpotMemberReadSerializer, SpotMemberWriteSerializer

User = get_user_model()

# 🚀 Annotate the path parameters explicitly for detail operations
@extend_schema_view(
    retrieve=extend_schema(parameters=[OpenApiParameter("id", OpenApiTypes.INT, OpenApiParameter.PATH)]),
    update=extend_schema(parameters=[OpenApiParameter("id", OpenApiTypes.INT, OpenApiParameter.PATH)]),
    partial_update=extend_schema(parameters=[OpenApiParameter("id", OpenApiTypes.INT, OpenApiParameter.PATH)]),
    destroy=extend_schema(parameters=[OpenApiParameter("id", OpenApiTypes.INT, OpenApiParameter.PATH)]),
)
class SpotMemberViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        """
        Dynamically filter staff listings to show only those who belong
        to the current user's active business spot profile.
        """
        active_spot = getattr(self.request.user.settings, 'active_spot', None)
        if not active_spot:
            return SpotMember.objects.none()
            
        # Optimization: use select_related to query user avatars/names instantly
        return SpotMember.objects.filter(spot=active_spot).select_related('user')

    def get_serializer_class(self):
        """Switch serializer shapes depending on read vs write execution methods."""
        if self.action in ['list', 'retrieve']:
            return SpotMemberReadSerializer
        return SpotMemberWriteSerializer

    @extend_schema(responses={201: SpotMemberReadSerializer})
    def create(self, request, *args, **kwargs):
        """Creates a staging invitation instead of an immediate spot member profile."""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email'].lower().strip()
        role = serializer.validated_data['role']
        active_spot = request.user.settings.active_spot

        # Check if this email is already registered on AfroSpot
        user_exists = User.objects.filter(email=email).exists()

        with transaction.atomic():
            # Revoke any prior pending invites for this exact email to this spot to clean up database duplicates
            SpotInvitation.objects.filter(spot=active_spot, email=email, status='pending').update(status='invoking')

            # Create new invitation token instance
            invite = SpotInvitation.objects.create(
                spot=active_spot,
                email=email,
                role=role
            )

        # Build the web-native redirect URL mapping matching your AcceptInvitationWebView routing
        # NOTE: Change this to your live domain (e.g., https://api.afrospot.com) when moving to production
        base_url = "http://127.0.0.1:8000" 
        invite_url = f"{base_url}/invite/accept/{invite.token}/"

        # Dispatch Multi-part Transactional Mail
        context = {
            'spot_name': active_spot.name,
            'role_display': role.capitalize(),
            'user_exists': user_exists, # Tells the email template whether to show "Log In" or "Sign Up" wording
            'invite_url': invite_url
        }
        html_content = render_to_string('emails/spot_invite.html', context)
        text_content = strip_tags(html_content)

        msg = EmailMultiAlternatives(
            subject=f"AfroSpot Invitation Request: Join {active_spot.name}",
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[email]
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return Response(
            {"detail": "Invitation email dispatched cleanly to target recipient staging pools."},
            status=status.HTTP_201_CREATED
        )
            
    @action(detail=False, methods=['post'], permission_classes=[], authentication_classes=[])
    def accept_invitation(self, request):
        """Anonymous token authorization validation endpoint."""
        token = request.data.get('token')
        password = request.data.get('password') # Only required if user doesn't have an account
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')

        try:
            invite = SpotInvitation.objects.get(token=token, status='pending')
        except (SpotInvitation.DoesNotExist, ValueError):
            return Response({"error": "Invalid or expired invitation token verification parameter."}, status=status.HTTP_400_BAD_REQUEST)

        if not invite.is_valid:
            return Response({"error": "This invitation link has expired."}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            user, created = User.objects.get_or_create(
                email=invite.email,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_client': True,
                    'is_active': True
                }
            )

            if created:
                if not password:
                    raise serializers.ValidationError({"password": "A secure password is required to create your profile."})
                user.set_password(password)
                user.save()

            # Attach user role securely to the target business profile
            SpotMember.objects.get_or_create(
                spot=invite.spot,
                user=user,
                defaults={'role': invite.role, 'is_active': True}
            )

            # Mark invitation as resolved
            invite.status = SpotInvitation.Status.ACCEPTED
            invite.save()

        return Response({"message": "Invitation confirmed successfully! Welcome to the team."}, status=status.HTTP_200_OK)

    @extend_schema(responses={200: SpotMemberReadSerializer})
    def update(self, request, *args, **kwargs):
        """Full update override."""
        return super().update(request, *args, **kwargs)

    @extend_schema(responses={200: SpotMemberReadSerializer})
    def partial_update(self, request, *args, **kwargs):
        """Modify role assignment targets for an existing staff member."""
        kwargs['partial'] = True
        instance = self.get_object()
        
        # When updating roles, the email address isn't required
        serializer = SpotMemberWriteSerializer(instance, data=request.data, partial=True, context={'request': request})
        serializer.is_valid(raise_exception=True)
        updated_member = serializer.save()
        
        response_serializer = SpotMemberReadSerializer(updated_member)
        return Response(response_serializer.data, status=status.HTTP_200_OK)