from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator

from django.db import models


class JogotalJog(models.Model):
    """Model for a jog."""
    MAX_DISTANCE = 10000.0  # 10 thousand miles
    MIN_DISTANCE = 0.01  # 0 miles.
    MAX_DURATION = 99.0  # 99 hours.
    MIN_DURATION = 0.01  # almost 0 hour.

    user = models.ForeignKey(User)
    distance = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[
            MaxValueValidator(MAX_DISTANCE),
            MinValueValidator(MIN_DISTANCE)
    ])
    duration = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[
            MaxValueValidator(MAX_DURATION),
            MinValueValidator(MIN_DURATION)
    ])
    recorded = models.DateTimeField()
    date_created = models.DateTimeField(auto_now_add=True)
    date_changed = models.DateTimeField(auto_now=True)

    @property
    def speed(self):
        """Calculate speed based on distance and duration."""
        return self.distance / self.duration

    @property
    def full_name(self):
        return self.user.get_full_name()

    class Meta:
        ordering = ['-recorded']
