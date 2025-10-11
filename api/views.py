# In api/views.py

from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.utils import timezone
from datetime import datetime, timedelta
from geopy.distance import great_circle

from .models import Salon, DailySchedule, Appointment
from .serializers import SalonSerializer, DailyScheduleSerializer, AppointmentSerializer, SalonDistanceSerializer

# --- ViewSets for Admin Dashboard ---
class SalonViewSet(viewsets.ModelViewSet):
    queryset = Salon.objects.all()
    serializer_class = SalonSerializer
    # permission_classes = [IsAuthenticated] # We will enable this later

class DailyScheduleViewSet(viewsets.ModelViewSet):
    queryset = DailySchedule.objects.all()
    serializer_class = DailyScheduleSerializer
    # permission_classes = [IsAuthenticated] # We will enable this later

# --- Views for Customer Flow ---
class NearbySalonListView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, format=None):
        # ... (This view is correct, no changes needed)
        try:
            user_lat = float(request.query_params.get('latitude'))
            user_lon = float(request.query_params.get('longitude'))
            user_location = (user_lat, user_lon)
        except (TypeError, ValueError):
            return Response({"error": "Valid 'latitude' and 'longitude' query parameters are required."}, status=status.HTTP_400_BAD_REQUEST)
        salons = Salon.objects.filter(latitude__isnull=False, longitude__isnull=False)
        salons_with_distance = []
        for salon in salons:
            salon_location = (salon.latitude, salon.longitude)
            distance = great_circle(user_location, salon_location).km
            salon.distance = distance
            salons_with_distance.append(salon)
        sorted_salons = sorted(salons_with_distance, key=lambda x: x.distance)
        serializer = SalonDistanceSerializer(sorted_salons, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class SalonAvailabilityView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk, format=None):
        # ... (This view is correct, no changes needed)
        date_str = request.query_params.get('date', None)
        if not date_str:
            return Response({"error": "A 'date' query parameter is required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            requested_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return Response({"error": "Invalid date format. Use YYYY-MM-DD."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            salon = Salon.objects.get(pk=pk)
            schedule = DailySchedule.objects.get(salon=salon, date=requested_date)
            existing_appointments = Appointment.objects.filter(salon=salon, start_time__date=requested_date)
        except (Salon.DoesNotExist, DailySchedule.DoesNotExist):
            return Response({"status": "closed"}, status=status.HTTP_200_OK)
        appointment_duration = 15
        time_slots = []
        current_slot_time = datetime.combine(requested_date, salon.opening_time)
        closing_time = datetime.combine(requested_date, salon.closing_time)
        now = timezone.now()
        current_tz = timezone.get_current_timezone()
        while current_slot_time < closing_time:
            aware_slot_time = timezone.make_aware(current_slot_time, current_tz)
            booked_count = existing_appointments.filter(start_time=aware_slot_time).count()
            is_available = (aware_slot_time > now and booked_count < schedule.num_workers)
            time_slots.append({"start_time": current_slot_time.strftime("%Y-%m-%dT%H:%M:%S"), "capacity": schedule.num_workers, "booked": booked_count, "is_available": is_available})
            current_slot_time += timedelta(minutes=appointment_duration)
        return Response(time_slots, status=status.HTTP_200_OK)

# --- THIS IS THE FIX FOR THE BOOKING LOGIC ---
class AppointmentCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = AppointmentSerializer(data=request.data)
        if serializer.is_valid():
            # Get data from the validated request
            salon_id = serializer.validated_data.get('salon').id
            start_time = serializer.validated_data.get('start_time')
            slot_date = start_time.date()

            # 1. Find the schedule and capacity for that day
            try:
                schedule = DailySchedule.objects.get(salon_id=salon_id, date=slot_date)
                capacity = schedule.num_workers
            except DailySchedule.DoesNotExist:
                return Response({"error": "No schedule found for this date. The salon is closed."}, status=status.HTTP_400_BAD_REQUEST)

            # 2. Count existing appointments for that exact time slot
            current_bookings = Appointment.objects.filter(salon_id=salon_id, start_time=start_time).count()

            # 3. Check if the slot is full
            if current_bookings >= capacity:
                return Response({"error": "This time slot is now full. Please select another time."}, status=status.HTTP_400_BAD_REQUEST)
            
            # 4. If not full, save the appointment
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# ---------------------------------------------

class StatsView(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, format=None):
        # ... (This view is correct, no changes needed)
        salon_count = Salon.objects.count()
        appointment_count = Appointment.objects.filter(start_time__date=timezone.now().date()).count()
        schedule_count = DailySchedule.objects.filter(date__gte=timezone.now().date()).count()
        stats = {"salons": salon_count, "appointments": appointment_count, "schedules": schedule_count}
        return Response(stats, status=status.HTTP_200_OK)