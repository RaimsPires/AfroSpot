from auth_kit.views import VerifyEmailView
from django.shortcuts import render

class VerifyEmailView(VerifyEmailView):
    def get(self, request, *args, **kwargs):
        # Extract the key from the URL parameters
        key = request.GET.get('key', '') or kwargs.get('key', '')

        # Render your custom HTML page with a standard form
        return render(request, 'users/verify_email.html', {'key': request.GET.get('key', '')})
