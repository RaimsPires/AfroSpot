from rest_framework import viewsets
from spots.models import Promotion
from spots.serializers import PromotionSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from itertools import chain
from spots.models import Product , Service


class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    
    def list(self, request, *args, **kwargs):
        query = request.query_params.get('q', '').strip()
        
        # 1. Fetch data
        products = Product.objects.filter(name__icontains=query)
        services = Service.objects.filter(name__icontains=query)
        
        # 2. Combine and Sort
        combined_results = sorted(
            chain(products, services), 
            key=lambda x: x.name.lower()
        )
        
        # 3. Paginate
        page = self.paginate_queryset(combined_results)
        
        if page is not None:
            # 4. Standardize data for the paginated slice
            results = []
            for item in page:
                results.append({
                    "id": str(item.id),
                    "name": item.name,
                    "image": request.build_absolute_uri(item.image.url) if hasattr(item, 'image') and item.image else None,
                    "type": "product" if isinstance(item, Product) else "service"
                })
            return self.get_paginated_response(results)

        # Fallback for non-paginated requests
        return Response([])
    
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