# In api/serializers.py

from rest_framework import serializers
from .models import Salon, DailySchedule, Appointment

# --- THE FIX IS HERE: Changed ModelViewSet to ModelSerializer ---
class SalonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Salon
        fields = '__all__'

class DailyScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySchedule
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

# This serializer was already correct, but we include it for completeness.
class SalonDistanceSerializer(serializers.ModelSerializer):
    distance = serializers.FloatField(read_only=True)
    class Meta:
        model = Salon
        # Using '__all__' is cleaner than listing every field manually
        fields = '__all__'