from django.urls import path

from .views import item_list, checkout_page

app_name = 'core'


urlpatterns = [
	path('', item_list, name='item-list'),
	path('/checkout-page/', checkout_page, name='checkout-page'),

]
