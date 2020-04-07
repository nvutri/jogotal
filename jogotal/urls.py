"""jogotal URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework import routers

from jogotal_users import views as users_views
from jogotal_jogs import views as jogs_views
from jogotal import views as jogotal_views

router = routers.SimpleRouter()
router.register(r'jogs', jogs_views.JogViewSet)
router.register(r'jogsadmin', jogs_views.JogAdminViewSet)
router.register(r'users', users_views.UserViewSet)

urlpatterns = [
    url(r'^index.html', jogotal_views.index),
    url(r'^api/', include(router.urls)),

    # Installed app.
    url(r'^auth/', include('djoser.urls.authtoken')),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^password_reset/', include('password_reset.urls')),

    url(r'^admin/', admin.site.urls),
    url(r'^(?:.*)/?$', jogotal_views.index),
]
