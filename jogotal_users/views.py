"""Handle view processing for users pages."""
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework import filters

from jogotal_users.serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    filter_backends = (filters.SearchFilter, DjangoFilterBackend,)
    search_fields = ['username', 'email', 'first_name', 'last_name']

    def get_queryset(self):
        if self.request.user.is_staff or self.request.user.has_perm('auth.add_user'):
            return User.objects.all().order_by('-date_joined')
        else:
            return User.objects.filter(pk=self.request.user.id).order_by('-date_joined')
