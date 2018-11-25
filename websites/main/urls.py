"""main URL Configuration

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
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.documentation import include_docs_urls
from rest_framework.schemas import get_schema_view

# from rest_framework_swagger.views import get_swagger_view
# schema_view2 = get_swagger_view(title='Swagger API')

schema_view = get_schema_view(title="Example API")

urlpatterns = [
    url(r'^schema/$', schema_view),
    url(r'^admin/', admin.site.urls),
    url(r'^api/', include('app.urls')),
    url(r'^api-auth/', include('rest_framework.urls')),
    url(r'^docs/', include_docs_urls(title='API Documente'))

    # url(r'^docs2/$', schema_view2),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += urlpatterns + static(settings.OUTSIDE_URL, document_root=settings.OUTSIDE_ROOT)
