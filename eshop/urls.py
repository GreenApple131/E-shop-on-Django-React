from django.conf import settings
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, re_path, include



urlpatterns = [
    path('accounts/', include('allauth.urls')),
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    
    path('admin/', admin.site.urls),
    # API from DRF for react
	path('api/', include('core.api.urls')),


    
	re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)