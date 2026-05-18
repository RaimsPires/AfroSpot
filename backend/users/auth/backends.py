import re
from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

User = get_user_model()

class EmailOrPhoneModelBackend(ModelBackend):
    """
    Allows users to log in with an email, a formatted global phone number,
    or a raw local phone number without the country code.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        login_id = username or kwargs.get('email')
        
        if not login_id:
            return None

        user = None

        try:
            # Route A: User typed an Email
            if '@' in login_id:
                user = User.objects.get(email__iexact=login_id)
                
            # Route B: User typed a Phone Number
            else:
                # Strip everything except numbers (removes +, spaces, dashes)
                clean_number = re.sub(r'\D', '', login_id)
                
                # Safety check: Ensure they typed a reasonable amount of digits
                if len(clean_number) >= 6:
                    # Search for any phone number ending in the digits typed
                    matched_users = User.objects.filter(phone_number__endswith=clean_number)
                    
                    if matched_users.count() == 1:
                        user = matched_users.first()
                    elif matched_users.count() > 1:
                        # Collision detected (Multiple users match the ending)
                        # Fail securely. Force them to use email or full country code.
                        return None
                    
        except User.DoesNotExist:
            return None

        # Verify password and account status
        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
            
        return None