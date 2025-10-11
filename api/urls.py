# In api/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    SalonViewSet, DailyScheduleViewSet,
    NearbySalonListView,
    SalonAvailabilityView, AppointmentCreateView, StatsView
)

router = DefaultRouter()
router.register(r'salons', SalonViewSet)
router.register(r'dailyschedule', DailyScheduleViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    # This is the crucial line that fixes the 404 error
    path('salons/nearby/', NearbySalonListView.as_view(), name='salon-nearby-list'),
    
    path('salons/<int:pk>/availability/', SalonAvailabilityView.as_view(), name='salon-availability'),
    path('appointments/', AppointmentCreateView.as_view(), name='appointment-create'),
    path('stats/', StatsView.as_view(), name='stats-view'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]