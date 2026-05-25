from django.shortcuts import render
from django.views import View


class PasswordResetLandingView(View):
    def get(self, request, *args, **kwargs):
        uid = request.GET.get('uid', '')
        token = request.GET.get('token', '')
        return render(
            request,
            'users/password_reset.html',
            {
                'uid': uid,
                'token': token,
            },
        )
