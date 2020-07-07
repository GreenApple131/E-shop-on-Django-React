from django.urls import path
from . import views


from .views import (
	CheckoutView, 
	OrderSummaryView, 
	ItemDetailView,
	HomeView, 
	add_to_cart, 
	remove_from_cart, 
	remove_single_item_from_cart, 
	PaymentView,

)


app_name = 'core'


urlpatterns = [
	path('', HomeView.as_view(), name='home'),
	path('checkout/', CheckoutView.as_view(), name='checkout'),
	path('order-summary/', OrderSummaryView.as_view(), name='order-summary'),
	path('product/<slug>/', ItemDetailView.as_view(), name='product'),
	path('add-to-cart/<slug>/', add_to_cart, name='add-to-cart'),
	path('remove-from-cart/<slug>/', remove_from_cart, name='remove-from-cart'),
	path('remove-item-from-cart/<slug>/', remove_single_item_from_cart, name='remove-single-item-from-cart'),
	# path('payment/<payment_option>', PaymentView, name='payment'),
	
	# stripe payment
	path('payment/stripe/config/', views.stripe_config),
	path('payment/create-checkout-session/', PaymentView.as_view(), name='create-checkout-session'),
	path('payment/stripe/success/', views.SuccessView.as_view()),
    path('payment/stripe/cancelled/', views.CancelledView.as_view()),
    # stripe payment

]
