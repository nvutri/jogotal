"""Handle view processing for jogging data."""
from isoweek import Week
from datetime import timedelta
from decimal import Decimal
from django.db.models import Avg, Sum, Count
from django.db.models.functions import Extract

from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.decorators import permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from jogotal_jogs.serializers import JogSerializer
from jogotal_jogs.models import JogotalJog

STATS_DAYS = 7  # One week.


class JogViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    queryset = JogotalJog.objects.all().order_by('-recorded')
    serializer_class = JogSerializer

    def get_queryset(self):
        return JogotalJog.objects.filter(user=self.request.user).order_by('-recorded')

    @list_route(methods=['get'])
    def stats(self, request):
        """Get stats of the last 7 days."""
        qs = self.get_queryset()
        qs = self.filter_queryset(qs)
        qs = qs.annotate(week=Extract('recorded', 'week'), year=Extract('recorded', 'year')).order_by('-year', '-week').values('week', 'year').annotate(
            Avg('distance'),
            Avg('duration'))
        response = []
        for item in qs:
            item['speed__avg'] = round(item['distance__avg'] / item['duration__avg'], 2)
            item['recorded'] = Week(item.get('year'), item.get('week')).monday()
            response.append(item)
        return Response(response)


class JogAdminViewSet(viewsets.ModelViewSet):
    """API endpoint that allows users to be viewed or edited."""
    queryset = JogotalJog.objects.all().order_by('-recorded')
    serializer_class = JogSerializer
    permission_classes = (IsAdminUser,)
    filter_fields = '__all__'
