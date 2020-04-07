from django.contrib.auth.models import User

from django.db import models
from localflavor.us import models as us_models


class UserProfile(models.Model):
    """Profile for a regular user."""
    user = models.OneToOneField(User, primary_key=True)
    date_of_birth = models.DateField(verbose_name='Date of Birth', blank=True, null=True)
    profile_picture = models.URLField(max_length=1000, blank=True, null=True)

    phone = us_models.PhoneNumberField(verbose_name='Phone', blank=True, null=True)
    country = models.CharField(max_length=255, blank=True, null=True)
    region = models.CharField(max_length=255, blank=True, null=True)
