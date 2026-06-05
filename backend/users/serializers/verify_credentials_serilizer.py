from rest_framework import serializers
from django.contrib.auth import authenticate

class VerifyCredentialsSerializer(serializers.Serializer):
    # write_only=True ensures these are never accidentally returned in a response
    login_id = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    

    def validate(self, attrs):
        login_id = attrs.get('login_id')
        password = attrs.get('password')

        if login_id and password:
            # We pass the request from the context so authenticate() works perfectly
            user = authenticate(
                request=self.context.get('request'), 
                username=login_id, 
                password=password
            )

            if not user:
                # 401 Unauthorized equivalent
                raise serializers.ValidationError(
                    {"error": "Invalid credentials."}, 
                    code="authorization"
                )

            if not user.is_active:
                # 403 Forbidden equivalent
                raise serializers.ValidationError(
                    {"error": "This account exists but is inactive or suspended."}, 
                    code="authorization"
                )

            # If everything is good, attach the user object to the validated data
            attrs['user'] = user
        else:
            raise serializers.ValidationError(
                {"error": "Must include 'login_id' and 'password'."}
            )

        return attrs