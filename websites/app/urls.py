from django.conf.urls import url, include
import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'userbase', views.UserViewSet)

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^', include(router.urls)),


]
    