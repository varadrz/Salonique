# In backend/urls.py

from django.contrib import admin
from django.urls import path, include

# --- THE FIX STARTS HERE ---
# 1. Import the specific view we need.
from api.views import NearbySalonListView
# -------------------------

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # --- THE FIX CONTINUES HERE ---
    # 2. Add the problematic URL directly to this main file.
    #    This bypasses any issues with the api/urls.py file.
    path('api/salons/nearby/', NearbySalonListView.as_view(), name='salon-nearby-list-direct'),
    
    # 3. Keep the original include for all other API routes.
    path('api/', include('api.urls')),
]