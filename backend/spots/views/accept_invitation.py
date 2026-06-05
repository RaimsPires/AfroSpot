from django.views.generic import TemplateView
from django.shortcuts import render
from django.db import transaction
from django.contrib.auth import get_user_model
from django.utils import timezone

from spots.models.spot_invitation import SpotInvitation
from spots.models.spot_member import SpotMember

User = get_user_model()

class AcceptInvitationWebView(TemplateView):
    template_name = 'spots/accept_invite.html'

    def get(self, request, token, *args, **kwargs):
        try:
            invite = SpotInvitation.objects.get(token=token, status='pending')
        except (SpotInvitation.DoesNotExist, ValueError):
            return render(request, 'spots/accept_invite.html', {'error': "This invitation link is completely invalid or has been revoked."})

        if invite.expires_at < timezone.now():
            invite.status = SpotInvitation.Status.EXPIRED
            invite.save()
            return render(request, 'spots/accept_invite.html', {'error': "This team invitation link has expired."})

        user_exists = User.objects.filter(email=invite.email).exists()
        
        return render(request, self.template_name, {
            'invite': invite,
            'spot_name': invite.spot.name,
            'user_exists': user_exists
        })

    def post(self, request, token, *args, **kwargs):
        try:
            invite = SpotInvitation.objects.get(token=token, status='pending')
        except SpotInvitation.DoesNotExist:
            return render(request, self.template_name, {'error': "Invitation context execution failed."})

        user_exists = User.objects.filter(email=invite.email).exists()
        
        first_name = request.POST.get('first_name', '').strip()
        last_name = request.POST.get('last_name', '').strip()
        phone_number = request.POST.get('phone_number', '').strip() # 🚀 Added
        dob = request.POST.get('dob') # 🚀 Added
        password = request.POST.get('password')

        try:
            with transaction.atomic():
                # 1. Fetch or initialize the user account structure
                user, created = User.objects.get_or_create(
                    email=invite.email,
                    defaults={
                        'first_name': first_name,
                        'last_name': last_name,
                        'phone_number': phone_number if phone_number else None, # 🚀 Bound directly
                        'dob': dob if dob else None, # 🚀 Bound directly
                        'is_client': True,
                        'is_active': True
                    }
                )

                if created:
                    if not password or len(password) < 8:
                        raise ValueError("Password must be at least 8 characters long.")
                    user.set_password(password)
                    user.save()

                # 2. Bridge the SpotMember role securely
                SpotMember.objects.get_or_create(
                    spot=invite.spot,
                    user=user,
                    defaults={'role': invite.role, 'is_active': True}
                )

                # 3. Complete the token sequence
                invite.status = SpotInvitation.Status.ACCEPTED
                invite.save()

            # Render the automatic redirection screen context on absolute success
            return render(request, 'spots/invite_success.html')

        except Exception as e:
            return render(request, self.template_name, {
                'invite': invite,
                'spot_name': invite.spot.name,
                'user_exists': user_exists,
                'error': str(e)
            })