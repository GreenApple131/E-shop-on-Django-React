from django.urls import path
from .views import (
    ItemListView,
    AddToCartView,
    OrderDetailView,
    PaymentView,
    AddCouponView,
    ItemDetailView,
    OrderItemDeleteView,
    OrderQuantityUpdateView
)

urlpatterns = [
    path('', ItemListView.as_view(), name='product-list'),
    path('search/', ItemListView.as_view(), name='product-search-list'),
    path('products/<slug>/', ItemDetailView.as_view(), name='product-detail'),
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('order-summary/', OrderDetailView.as_view(), name='order-summary'),
    path('checkout/', PaymentView.as_view(), name='checkout'),
    path('add-coupon/', AddCouponView.as_view(), name='add-coupon'),
    path('order-items/<pk>/delete/',
         OrderItemDeleteView.as_view(), name='order-item-delete'),
    path('order-item/update-quantity/',
         OrderQuantityUpdateView.as_view(), name='order-item-update-quantity'),
         
]
