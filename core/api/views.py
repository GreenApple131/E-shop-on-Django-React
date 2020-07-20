from django.conf import settings
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView,DetailView, View
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import TemplateView
from django.http.response import JsonResponse
from django.utils import timezone
from django.contrib import messages
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from core.models import Item
from .serializers import ItemSerializer

class ItemListView(ListAPIView):
    permission_classes = (AllowAny, )
    serializer_class = ItemSerializer
    queryset = Item.objects.all()


class AddToCartView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        if slug is None:
            return Response({"message":"Invalid request"}, status=HTTP_400_BAD_REQUEST)
        else:
            item = get_object_or_404(Item, slug=slug)
            order_item, created = OrderItem.objects.get_or_create(
                item=item,
                user=request.user,
                ordered=False,
                )
            order_qs = Order.objects.filter(user=request.user, ordered=False)
            if order_qs.exists():
                order = order_qs[0]
                # check if the order item is in the order
                if order.items.filter(item__slug=item.slug).exists():
                    order_item.quantity += 1
                    order_item.save()
                    return Response(status=HTTP_200_OK)
                else:
                    order_item.quantity == 0
                    order.items.add(order_item)
                    return Response(status=HTTP_200_OK)
            else:
                ordered_date = timezone.now()
                order = Order.objects.create(user=request.user, ordered_date=ordered_date)
                order.items.add(order_item)
                return Response(status=HTTP_200_OK)
