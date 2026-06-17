from rest_framework import serializers
from django.db import transaction
import json
from spots.models import Event, EventVendorTier ,  EventTicketTier
from django.utils.text import slugify
import uuid

# --- Existing Ticket Tier Serializer ---
class EventTicketTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventTicketTier
        fields = ['id', 'name', 'price', 'capacity', 'quantity_sold', 'is_active']
        read_only_fields = ['id', 'quantity_sold']

# --- 🚀 NEW: Vendor Tier Serializer ---
class EventVendorTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventVendorTier
        fields = ['id', 'name', 'price', 'capacity', 'quantity_sold', 'is_active']
        read_only_fields = ['id', 'quantity_sold']

# --- Main Event Serializer ---
class EventSerializer(serializers.ModelSerializer):
    ticket_tiers = EventTicketTierSerializer(many=True, read_only=True)
    vendor_tiers = EventVendorTierSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'description', 'category',
            'banner_image', 'start_datetime', 'end_datetime', 
            'event_type', 'status', 'custom_address', 
            'ticket_tiers', 'vendor_tiers' 
        ]
        read_only_fields = ['id', 'slug', 'status']

    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get('request')
        validated_data['spot'] = request.user.settings.active_spot
        
        # Generate Slug
        title = validated_data.get('title', '')
        validated_data['slug'] = f"{slugify(title)}-{uuid.uuid4().hex[:6]}"
        
        # Extract the image file safely
        banner_image = request.FILES.get('banner_image')
        if banner_image:
            validated_data['banner_image'] = banner_image
            
        # 1. Create the base Event record
        event = super().create(validated_data)

        # 2. Process Ticket Tiers from FormData
        # Because we send multipart/form-data from React Native, arrays arrive as JSON strings
        tickets_data_str = request.POST.get('ticket_tiers', '[]')
        try:
            tickets_data = json.loads(tickets_data_str)
            for ticket in tickets_data:
                # Ensure they provided a name and capacity before creating
                if ticket.get('name') and ticket.get('capacity'):
                    EventTicketTier.objects.create(
                        event=event,
                        name=ticket['name'],
                        price=ticket.get('price', 0),
                        capacity=ticket['capacity']
                    )
        except json.JSONDecodeError:
            pass # Handle error appropriately in production

        # 3. Process Vendor Tiers from FormData
        vendors_data_str = request.POST.get('vendor_tiers', '[]')
        try:
            vendors_data = json.loads(vendors_data_str)
            for vendor in vendors_data:
                if vendor.get('name') and vendor.get('capacity'):
                    EventVendorTier.objects.create(
                        event=event,
                        name=vendor['name'],
                        price=vendor.get('price', 0),
                        capacity=vendor['capacity']
                    )
        except json.JSONDecodeError:
            pass

        return event
    
    @transaction.atomic
    def update(self, instance, validated_data):
        request = self.context.get('request')

        # 1. Update basic fields
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.category = validated_data.get('category', instance.category)
        instance.start_datetime = validated_data.get('start_datetime', instance.start_datetime)
        instance.end_datetime = validated_data.get('end_datetime', instance.end_datetime)
        
        if 'banner_image' in validated_data:
            instance.banner_image = validated_data['banner_image']
            
        instance.save()

        # 2. Update Tiers (Delete existing and recreate)
        # This is the safest way to handle nested array updates via FormData
        if 'ticket_tiers' in request.POST:
            instance.ticket_tiers.all().delete()
            tickets_data = json.loads(request.POST.get('ticket_tiers', '[]'))
            for t in tickets_data:
                EventTicketTier.objects.create(event=instance, **t)

        if 'vendor_tiers' in request.POST:
            instance.vendor_tiers.all().delete()
            vendors_data = json.loads(request.POST.get('vendor_tiers', '[]'))
            for v in vendors_data:
                EventVendorTier.objects.create(event=instance, **v)

        return instance