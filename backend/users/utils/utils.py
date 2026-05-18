from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

User = get_user_model()

@api_view(['POST'])
def verify_registration_otp(request):
    """
    View to handle OTP verification during new user registration.
    """
    phone_number = request.data.get('phone_number') # e.g. +237670123456
    entered_otp = request.data.get('otp')
    email = request.data.get('email')
    password = request.data.get('password')

    # 1. Verify the OTP with your provider (Twilio, AWS, etc.)
    # is_valid = check_otp_with_provider(phone_number, entered_otp)
    is_valid = True # Assuming success for this example

    if not is_valid:
        return Response({"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST)

    # 2. Steal-and-Swap Logic (Phone Number Recycling)
    # Look for an old account using this phone number
    existing_user = User.objects.filter(phone_number=phone_number).first()
    
    if existing_user:
        # Unlink the phone number from the old account
        existing_user.phone_number = None
        existing_user.save(update_fields=['phone_number'])
        # Optional: Trigger an email to existing_user.email to notify them

    # 3. Create the new user safely
    new_user = User.objects.create_user(
        email=email,
        password=password,
    )
    # Assign the phone number
    new_user.phone_number = phone_number
    new_user.save(update_fields=['phone_number'])

    return Response({"message": "Account created successfully!"}, status=status.HTTP_201_CREATED)