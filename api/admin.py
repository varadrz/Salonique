
from django.contrib import admin
from .models import Salon, DailySchedule, Appointment

# Registering models to make them accessible via the Django admin interface
admin.site.register(Salon)
admin.site.register(DailySchedule)
admin.site.register(Appointment)