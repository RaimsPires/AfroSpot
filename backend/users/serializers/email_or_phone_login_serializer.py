from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _

class EmailOrPhoneLoginSerializer(serializers.Serializer):
    # Use CharField instead of EmailField so it accepts phone numbers!
    login_id = serializers.CharField(required=True, write_only=True)
    password = serializers.CharField(
        required=True, 
        write_only=True, 
        style={'input_type': 'password'}
    )

    def validate(self, attrs):
        login_id = attrs.get('login_id')
        password = attrs.get('password')

        if login_id and password:
            request = self.context.get('request')
            
            # THIS is the function that triggers your EmailOrPhoneModelBackend
            user = authenticate(request=request, username=login_id, password=password)
            
            if not user:
                raise serializers.ValidationError(
                    _("Unable to log in with provided credentials."), 
                    code='authorization'
                )
        else:
            raise serializers.ValidationError(
                _("Must include 'login_id' and 'password'."), 
                code='authorization'
            )

        self.context["user"] = user
        return attrs