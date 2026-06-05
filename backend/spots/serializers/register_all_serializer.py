from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.db import transaction
from spots.models.spot import Spot
from spots.models.spot_member import SpotMember

User = get_user_model()

class RegisterAllSerializer(serializers.Serializer):
    # Optional field: If passed, we lookup and update this user
    user_id = serializers.IntegerField(required=False, allow_null=True)
    
    # User Creation Fields (Only validated if user_id is missing)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    user_email = serializers.EmailField(required=False)
    user_phone = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(required=False, write_only=True)
    date_of_birth = serializers.DateField(required=False, allow_null=True)
    avatar = serializers.ImageField(required=False, allow_null=True)

    # Business/Spot Fields
    business_name = serializers.CharField()
    business_address = serializers.CharField(required=False, allow_blank=True)
    business_email = serializers.EmailField(required=False, allow_blank=True)
    tax_number = serializers.CharField(required=False, allow_blank=True)
    business_phone = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False, default='other')
    country = serializers.CharField(required=False, allow_blank=True)
    
    # Images
    banner_image = serializers.ImageField(required=False, allow_null=True)
    profile_image = serializers.ImageField(required=False, allow_null=True)
    kyc_document = serializers.ImageField(required=False, allow_null=True)

    def validate(self, attrs):
        user_id = attrs.get('user_id')
        
        # If no user_id is provided, enforce registration inputs
        if not user_id:
            email = attrs.get('user_email')
            password = attrs.get('password')
            if not email or not password:
                raise serializers.ValidationError({
                    "user_email": "This field is required when creating a new user account.",
                    "password": "This field is required when creating a new user account."
                })
            if User.objects.filter(email=email.lower().strip()).exists():
                raise serializers.ValidationError({"user_email": "A user with this email already exists."})
                
        return attrs

    def save(self):
        validated_data = self.validated_data
        user_id = validated_data.get('user_id')
        
        # 🛡️ Run operations safely inside a DB transaction block
        with transaction.atomic():
            
            # --- PHASE 1: GET OR CREATE USER ---
            if user_id:
                try:
                    user = User.objects.get(id=user_id)
                    # If they were already a client, updating this flag makes them BOTH!
                    user.is_store_owner = True 
                    user.save()
                except User.DoesNotExist:
                    raise serializers.ValidationError({"user_id": "The provided User ID does not exist."})
            else:
                # Create a completely new user record
                user = User.objects.create_user(
                    email=validated_data['user_email'].lower().strip(),
                    password=validated_data['password'],
                    first_name=validated_data.get('first_name', ''),
                    last_name=validated_data.get('last_name', ''),
                    phone_number=validated_data.get('user_phone') or None,
                    dob=validated_data.get('date_of_birth'),
                    profile_picture=validated_data.get('avatar'),
                    is_client=True,       # Defaults to true as client
                    is_store_owner=True   # Automatically set to true because they are opening a business
                )

            # --- PHASE 2: GENERATE SPOT / BUSINESS ---
            # Create unique URL slug out of business name
            base_slug = slugify(validated_data['business_name'])
            slug = base_slug
            counter = 1
            while Spot.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            spot = Spot.objects.create(
                name=validated_data['business_name'],
                slug=slug,
                address=validated_data.get('business_address', ''),
                phone_number=validated_data.get('business_phone') or None,
                country=validated_data.get('country', ''),
                category=validated_data.get('category', 'other').lower(),
                logo=validated_data.get('profile_image'),
                banner_image=validated_data.get('banner_image'),
                business_license=validated_data.get('kyc_document'),
                email=validated_data.get('business_email'),
                is_active=True,
                is_verified=False # Pending manual KYC approval
            )

            # --- PHASE 3: LINK USER AND SPOT VIA SPOTMEMBER ---
            SpotMember.objects.create(
                spot=spot,
                user=user,
                role=SpotMember.Role.OWNER,
                is_active=True
            )

        return user, spot