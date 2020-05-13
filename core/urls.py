from django.urls import path

from .views import home, checkout, ItemDetailView, HomeView

app_name = 'core'


urlpatterns = [
	path('', HomeView.as_view(), name='home'),
	path('checkout/', checkout, name='checkout'),
	path('product/<slug>/', ItemDetailView.as_view(), name='product'),

]
