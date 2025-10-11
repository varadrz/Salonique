from django.db import models
from django.utils import timezone

class Salon(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15)
    opening_time = models.TimeField(default='09:00:00')
    closing_time = models.TimeField(default='21:00:00')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)    

    def __str__(self):
        return self.name

class DailySchedule(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='schedules')
    date = models.DateField()
    num_workers = models.PositiveSmallIntegerField(default=1, help_text="Number of available staff for this day.")

    class Meta:
        # Ensures a salon can only have one schedule entry per day
        unique_together = ('salon', 'date')

    def __str__(self):
        return f"{self.salon.name} on {self.date} ({self.num_workers} workers)"

class Appointment(models.Model):
    salon = models.ForeignKey(Salon, on_delete=models.CASCADE, related_name='appointments')
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=15)
    start_time = models.DateTimeField()
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        # Using IST for display would be a good future enhancement
        return f"Appointment for {self.customer_name} at {self.salon.name} on {self.start_time.strftime('%Y-%m-%d %H:%M')}"
    

