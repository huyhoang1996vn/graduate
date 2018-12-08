from django.conf.urls import url, include
import views
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import settings


urlpatterns = [
    url(r'^paypal/$', views.paypal_interact, name='paypal_interact'),
    url(r'^push/notification/$', views.push_notification, name='push_notification'),
    url(r'^connect/notification/$', views.connect_notification, name='connect_notification'),
    url(r'^send/notification/$', views.send_notification, name='send_notification'),


]