from django.urls import path , include
from .views import (RegisterAllView , BulkOperatingHoursView , SpotMemberViewSet,AcceptInvitationWebView,SpotInvitationViewSet,ActiveSpotView,ProductViewSet,ProductImageDetailView,ServiceViewSet,ServiceImageDetailView,EventViewSet)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'spots/members', SpotMemberViewSet, basename='spot-members')
router.register(r'spots/invitations', SpotInvitationViewSet, basename='spot-invitations')
router.register(r'products', ProductViewSet, basename='products')
router.register(r'services', ServiceViewSet, basename='services')
router.register(r'events', EventViewSet, basename='events')

urlpatterns = [
    path('spots/register-all/', RegisterAllView.as_view(), name='register-all'),
    path('spots/operating-hours/', BulkOperatingHoursView.as_view(), name='manage-operating-hours'),
    path('invite/accept/<str:token>/', AcceptInvitationWebView.as_view(), name='accept-invitation-web'),
    path('spots/active/', ActiveSpotView.as_view(), name='active-spot'),
    path('active/', ActiveSpotView.as_view(), name='active-spot'),
    path('products/images/<uuid:pk>/',ProductImageDetailView.as_view(),name='product-image-detail'),
    path(
        'services/images/<uuid:pk>/', 
        ServiceImageDetailView.as_view(), 
        name='service-image-detail'
    ),
    path('', include(router.urls)),
]