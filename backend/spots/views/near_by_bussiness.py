import random
from django.db.models import FloatField, Value, ExpressionWrapper
from django.db.models.functions import ACos, Cos, Radians, Sin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from spots.models import Spot
from spots.serializers import NearbyBusinessSerializer


class NearbyBusinessView(APIView):
    def get(self, request):
        # 1. Extract and validate parameters
        user_lat = request.query_params.get('latitude')
        user_lng = request.query_params.get('longitude')
        country = request.query_params.get('country', '').strip()
        radius = request.query_params.get('radius', 10)  # Default 10km

        if not user_lat or not user_lng:
            return Response(
                {"error": "Please provide both latitude and longitude query parameters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_lat = float(user_lat)
            user_lng = float(user_lng)
            radius = float(radius)
        except ValueError:
            return Response(
                {"error": "Latitude, longitude, and radius must be valid numbers."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Build the Haversine distance expression
        distance_expression = ExpressionWrapper(
                6371 * ACos(
                    Cos(Radians(user_lat)) * Cos(Radians('latitude')) *
                    Cos(Radians('longitude') - Radians(user_lng)) +
                    Sin(Radians(user_lat)) * Sin(Radians('latitude'))
                ),
                output_field=FloatField()
            )

        # --- STAGE 1: Target Search (Businesses within Radius) ---
        queryset = (
            Spot.objects.filter(
                shop_type=Spot.ShopType.BUSINESS,
                is_active=True,
                latitude__isnull=False,
                longitude__isnull=False
            )
            .annotate(distance_km=distance_expression)
            .filter(distance_km__lte=radius)
            .order_by('distance_km')
        )

        # Track what dataset fallback strategy was utilized
        source_strategy = "geo_radius"

        # --- STAGE 2: Fallback to Country Restaurants ---
        if not queryset.exists() and country:
            queryset = Spot.objects.filter(
                category=Spot.Category.RESTAURANT,
                country__iexact=country,
                is_active=True
            ).annotate(distance_km=distance_expression)
            source_strategy = "fallback_country_restaurants"

        # --- STAGE 3: Fallback to Continent / Global Restaurants ---
        if not queryset.exists():
            queryset = Spot.objects.filter(
                category=Spot.Category.RESTAURANT,
                is_active=True
            ).annotate(distance_km=distance_expression)
            source_strategy = "fallback_global_restaurants"

        # 3. Randomize the fallback selection if needed
        # We transform to list to easily draw elements out cleanly
        results_list = list(queryset)
        
        if source_strategy != "geo_radius" and results_list:
            # Randomly select up to 5 elements so the user gets fresh content on refresh
            sample_size = min(5, len(results_list))
            results_list = random.sample(results_list, sample_size)

        # 4. Serialize and append metadata headers
        serializer = NearbyBusinessSerializer(results_list, many=True, context={'request': request})
        
        return Response({
            "strategy": source_strategy,
            "count": len(serializer.data),
            "results": serializer.data
        }, status=status.HTTP_200_OK)