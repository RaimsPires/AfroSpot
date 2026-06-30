from rest_framework import viewsets
from spots.models import Promotion
from spots.serializers import PromotionSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from itertools import chain
from spots.models import Product , Service
from utils.pagination import StandardResultsSetPagination

class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    pagination_class = StandardResultsSetPagination
    
    def get_serializer_context(self):
        return {'request': self.request}
    
    # In your PromotionViewSet
    def list(self, request, *args, **kwargs):
        # Fetch all promotions (not products/services)
        queryset = Promotion.objects.all().order_by('-created_at')
        
        # Paginate
        page = self.paginate_queryset(queryset)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        return Response(self.get_serializer(queryset, many=True).data)
    
    @action(detail=False, methods=['get'])
    def search_items(self, request):
        query = request.query_params.get('q', '').strip()
        
        # 1. Base Queries (Limit to 20 each to keep it fast, adjust as needed)
        if query:
            products = Product.objects.filter(name__icontains=query)[:20]
            services = Service.objects.filter(name__icontains=query)[:20]
        else:
            products = Product.objects.all()[:20]
            services = Service.objects.all()[:20]

        results = []

        # 2. Standardize Product Data
        for p in products:
            image_url = request.build_absolute_uri(p.image.url) if getattr(p, 'image', None) else None
            results.append({
                "id": str(p.id),
                "name": p.name,
                "image": image_url,
                "type": "product"
            })

        # 3. Standardize Service Data
        for s in services:
            image_url = request.build_absolute_uri(s.image.url) if getattr(s, 'image', None) else None
            results.append({
                "id": str(s.id),
                "name": s.name,
                "image": image_url,
                "type": "service"
            })

        # 4. Sort the combined list alphabetically by name
        results = sorted(results, key=lambda x: x['name'].lower())

        return Response(results)