from django.conf.urls import url, include
import views
from rest_framework import routers
from django.conf.urls.static import static
from django.conf import settings

router = routers.DefaultRouter()
router.register(r'userbase', views.UserViewSet)
router.register(r'product', views.ProductViewSet)
router.register(r'category', views.CategoryViewSet)
router.register(r'owner', views.OwnerViewSet)
router.register(r'customer', views.CustomerViewSet)


urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^', include(router.urls)),
    url(r'^register/$', views.UserViewSet.as_view({'post': 'create'})),

]
    