from django.conf.urls import url, include
import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'userbase', views.UserViewSet)
router.register(r'product', views.ProductViewSet)
router.register(r'category', views.CategoryViewSet)


urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^', include(router.urls)),

]
    