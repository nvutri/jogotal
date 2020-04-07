from jogotal_jogs.models import JogotalJog

from rest_framework import serializers


class JogSerializer(serializers.ModelSerializer):
    speed = serializers.DecimalField(max_digits=7, decimal_places=1, read_only=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = JogotalJog
        fields = '__all__'
