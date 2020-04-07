# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin
from jogotal_jogs.models import JogotalJog


class JogotalJogAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'recorded', 'duration', 'distance')


# Register your models here.
admin.site.register(JogotalJog, JogotalJogAdmin)
