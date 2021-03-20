from django.views.decorators.csrf import csrf_exempt
from django.urls import path, include
from rest_framework import routers
from core.api import views


router = routers.DefaultRouter()
router.register('items', views.ItemsView)
router.register('sizes', views.SizeView)
router.register('other-mark', views.OtherMarkView)
router.register('todo', views.TodoUpdate)


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



    path('product-list/', views.productList, name="product-list"),
    path('product-detail/<pk>/', views.productDetail, name="product-detail"),
    path('product-create/', views.productCreate, name="product-create"),
    path('product-update/<pk>/', views.productUpdate, name="product-update"),
    path('product-delete/<pk>/', views.productDelete, name="product-delete"),



#     path('todos/', views.TodoCreate.as_view(), name='todos'),
#     path('todo-list/', views.todoList, name="item-list"),
    #     path('todo-detail/<str:pk>/', views.todoDetail, name="item-detail"),
    #     path('todo-create/', views.TodoCreate, name="item-create"),
#     path('todo-update/<pk>/', views.todoUpdate, name="item-update"),
#     path('todo-delete/<pk>/', views.todoDelete, name="item-delete"),


    path('i/', include(router.urls)),
#     path('prods/', views.PostView.as_view(), name='post_list'),

]
