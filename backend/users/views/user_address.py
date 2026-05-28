from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from users.models import UserAddress
from users.serializers.user_addresses_serilizer import (
    UserAddressCreateSerializer,
    UserAddressSerializer,
)


class UserAddressCreateView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=UserAddressCreateSerializer,
        responses={status.HTTP_201_CREATED: UserAddressSerializer},
    )
    @transaction.atomic
    def post(self, request):
        serializer = UserAddressCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        requested_primary = serializer.validated_data.get('is_active', False)
        has_existing_addresses = UserAddress.objects.filter(user=request.user).exists()
        should_be_primary = requested_primary or not has_existing_addresses

        if should_be_primary:
            UserAddress.objects.filter(user=request.user, is_active=True).update(is_active=False)

        address = serializer.save(user=request.user, is_active=should_be_primary)
        return Response(UserAddressSerializer(address).data, status=status.HTTP_201_CREATED)


class UserAddressSetPrimaryView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={status.HTTP_200_OK: UserAddressSerializer},
    )
    @transaction.atomic
    def patch(self, request, address_id):
        address = get_object_or_404(UserAddress, id=address_id, user=request.user)

        if not address.is_active:
            UserAddress.objects.filter(user=request.user, is_active=True).update(is_active=False)
            address.is_active = True
            address.save(update_fields=['is_active', 'updated_at'])

        return Response(UserAddressSerializer(address).data, status=status.HTTP_200_OK)


class UserAddressUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=UserAddressCreateSerializer,
        responses={status.HTTP_200_OK: UserAddressSerializer},
    )
    @transaction.atomic
    def patch(self, request, address_id):
        address = get_object_or_404(UserAddress, id=address_id, user=request.user)
        serializer = UserAddressCreateSerializer(address, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        requested_primary = serializer.validated_data.get('is_active', address.is_active)

        if requested_primary:
            UserAddress.objects.filter(user=request.user, is_active=True).exclude(id=address.id).update(is_active=False)

        updated_address = serializer.save(is_active=requested_primary)
        return Response(UserAddressSerializer(updated_address).data, status=status.HTTP_200_OK)


class UserAddressDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=None,
        responses={status.HTTP_204_NO_CONTENT: None},
    )
    @transaction.atomic
    def delete(self, request, address_id):
        address = get_object_or_404(UserAddress, id=address_id, user=request.user)

        if address.is_active:
            return Response(
                {'error': 'Cannot delete your primary address. Set another address as primary first.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        address.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)