from django.views.decorators.csrf import csrf_exempt
from django.urls import path, include
from core.api import views


urlpatterns = [
    path('', views.ItemListView.as_view(), name='product-list'),
    path('search/', views.ItemListView.as_view(), name='product-search-list'),
    # path('', include(router.urls)),
    path('products/<slug>/', views.ItemDetailView.as_view(), name='product-detail'),
    path('add-to-cart/', views.AddToCartView.as_view(), name='add-to-cart'),
    path('order-summary/', views.OrderDetailView.as_view(), name='order-summary'),
    path('checkout/', views.PaymentView.as_view(), name='checkout'),
    path('add-coupon/', views.AddCouponView.as_view(), name='add-coupon'),
    path('order-items/<pk>/delete/',
         views.OrderItemDeleteView.as_view(), name='order-item-delete'),
    path('order-item/update-quantity/',
         views.OrderQuantityUpdateView.as_view(), name='order-item-update-quantity'),

    path('item-list/', views.itemList, name="item-list"),
	path('item-detail/<str:pk>/', views.itemDetail, name="item-detail"),
	path('item-create/', views.itemCreate, name="item-create"),
	path('item-update/<str:pk>/', views.itemUpdate, name="item-update"),
	path('item-delete/<str:pk>/', views.itemDelete, name="item-delete"),


]
