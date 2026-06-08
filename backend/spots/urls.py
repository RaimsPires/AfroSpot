from django.urls import path , include
from .views import RegisterAllView , BulkOperatingHoursView , SpotMemberViewSet,AcceptInvitationWebView,SpotInvitationViewSet,ActiveSpotView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'spots/members', SpotMemberViewSet, basename='spot-members')
router.register(r'spots/invitations', SpotInvitationViewSet, basename='spot-invitations')

urlpatterns = [
    path('spots/register-all/', RegisterAllView.as_view(), name='register-all'),
    path('spots/operating-hours/', BulkOperatingHoursView.as_view(), name='manage-operating-hours'),
    path('invite/accept/<str:token>/', AcceptInvitationWebView.as_view(), name='accept-invitation-web'),
    path('', include(router.urls)),
    path('spots/active/', ActiveSpotView.as_view(), name='active-spot'),
]