from django.conf import settings
from django.utils import timezone
from django.shortcuts import render, get_object_or_404, redirect
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.views.generic.base import TemplateView
from django.http.response import JsonResponse
from django.http import Http404


from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, DestroyAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework import filters
from django_filters import rest_framework as django_filters
from django_filters.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from core.models import Item, OrderItem, Order, BillingAddress, Sizes, Payment, Coupon, Refund
from .serializers import ItemSerializer, OrderSerializer, ItemDetailSerializer


import stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class MultiValueCharFilter(django_filters.BaseInFilter, django_filters.CharFilter):
    # Так як наші categories and other_marks мають відношення ManyToMany, щоб фільтрувати їх діапазон ВСЕРЕДИНІ (lookup_expr='in') використовуємо django_filters.BaseInFilter.  
    # django_filters.CharFilter підключається тому, що ми шукаємо не по primary_key(pk), а по Char словах('Jackets', 'Hats' і тд.)
    # запит виглядає так http://localhost:8000/api/?category=Hats,Jackets і видає результат по шуканих категоріях "Hats + Jackets"
    pass


class ItemFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name="title", lookup_expr='icontains')
    category = MultiValueCharFilter(field_name="category", lookup_expr='in') # call custom filter class
    other_marks = MultiValueCharFilter(field_name='other_marks__mark', lookup_expr='in') # call custom filter class
    price = django_filters.RangeFilter(field_name="price") # range from min to max
    ordering = django_filters.OrderingFilter(
        fields={
            'price': 'price',
            'title': 'title',
            # add 'discount_price' and 'star rate'(оцінка)
        })
        # http://localhost:8000/api/?category=Hats&ordering=-price 

    class Meta:
        model = Item
        fields = ['title', 'price', 'category', 'other_marks']


class ItemListView(ListAPIView):
    queryset = Item.objects.all()
    permission_classes = (AllowAny, )
    serializer_class = ItemSerializer
    filterset_class = ItemFilter
    
    # ordering = ['username']

    # filter_backends = [filters.OrderingFilter]
    # filter_fields = ['price', 'size', 'discount_price', 'category', 'category_type']
    # search_fields = ['title']


class ItemDetailView(RetrieveAPIView):
    permission_classes = (AllowAny, )
    serializer_class = ItemDetailSerializer
    queryset = Item.objects.all()
    lookup_field = 'slug'
    


class OrderQuantityUpdateView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None) # get slug OR None
        if slug is None:
            return Response({"message": "Invalid data"}, status=HTTP_400_BAD_REQUEST)

        item = get_object_or_404(Item, slug=slug)
        order_qs = Order.objects.filter(
            user=request.user,
            ordered=False
        )
        if order_qs.exists():
            order = order_qs[0]
            # check if the order item is in the order
            if order.items.filter(item__slug=item.slug).exists():
                order_item = OrderItem.objects.filter(
                    item=item,
                    user=request.user,
                    ordered=False
                )[0]
                if order_item.quantity > 1:
                    order_item.quantity -= 1
                    order_item.save()
                else:
                    order_item.delete()
                return Response(status=HTTP_200_OK)
            else:
                return Response({"message": "This item was not in your cart"}, status=HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class OrderItemDeleteView(DestroyAPIView):
    permission_classes = (IsAuthenticated, )
    queryset = OrderItem.objects.all()


class AddToCartView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        # приймаємо розмір, колір предмету по id, або порожній масив [], так як предмет може не мати вибіркових параметрів
        variations = request.data.get('variations', [])
        if slug is None:
            return Response({"message": "Invalid request"}, status=HTTP_400_BAD_REQUEST)

        item = get_object_or_404(Item, slug=slug)

        # поки що реалізовано тільки по розмірах. треба додати інші фільтри
        # після реалізації інших позицій для вибору можна буде розкоментувати ці три рядки нижче

        # minimum_variation_count = item.objects.filter(item=item).count()
        # if len(variations) < minimum_variation_count:
        #     return Response({"message": "Please specify the required variations"}, status=HTTP_400_BAD_REQUEST)

        order_item_qs = OrderItem.objects.filter(
            item=item,
            user=request.user,
            ordered=False
        )

        for v in variations:  # [1, 4]
            order_item_qs = order_item_qs.filter(
                item_size__exact=v
            )

        if order_item_qs.exists():
            order_item = order_item_qs.first()
            order_item.quantity += 1
            order_item.save()
        else:
            order_item = OrderItem.objects.create(
                item=item,
                user=request.user,
                ordered=False
            )
        # *variations додає за один раз усі можливі прийняті вибрані фільтри якщо їх багато. Надходять вони у вигляді масиву [3,6](якщо треба вибрати дві позиції(розмір, колір) по айдішниках)
        order_item.item_size.add(*variations)
        order_item.save()

        order_qs = Order.objects.filter(user=request.user, ordered=False)
        if order_qs.exists():
            order = order_qs[0]
            # check if the order item is in the order
            print('order_item.quantity', order_item.quantity)
            if not order.items.filter(item__id=order_item.id).exists():
                order.items.add(order_item)
                return Response(status=HTTP_200_OK)
        else:
            ordered_date = timezone.now()
            order = Order.objects.create(
                user=request.user, ordered_date=ordered_date)
            order.items.add(order_item)
            return Response(status=HTTP_200_OK)


class OrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_class = (IsAuthenticated, )

    def get_object(self):
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            return order
        except ObjectDoesNotExist:
            raise Http404("You do not have an active order")
            # return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


# stripe part
class PaymentView(APIView):

    def post(self, request, *args, **kwargs):
        order = Order.objects.get(user=self.request.user, ordered=False)
        userprofile = UserProfile.objects.get(user=self.request.user)
        token = request.get('stripeToken')

        stripe.api_key = "sk_test_51H1x1XK0Ldnw408vNVMO4DeIGzr5V6wb2cP0LXXgdVQJU6UeuajbDKqXMSSt5UuiuETcydLUclIIfjKIqn50c0s1001XzmU8J6"

        if userprofile.stripe_customer_id != '' and userprofile.stripe_customer_id is not None:
            customer = stripe.Customer.retrieve(
                userprofile.stripe_customer_id)
            customer.sources.create(source=token)

        else:
            customer = stripe.Customer.create(
                email=self.request.user.email,
            )
            customer.sources.create(source=token)
            userprofile.stripe_customer_id = customer['id']
            userprofile.one_click_purchasing = True
            userprofile.save()

        amount = int(order.get_total() * 100)

        try:

            charge = stripe.Charge.create(
                amount=amount,
                currency="eur",
                description="My First Test Charge (created for API docs)",
                source=token,  # obtained with Stripe.js
            )

            # charge = stripe.Charge.create(
            #     amount=amount,  # cents
            #     currency="usd",
            #     # customer=userprofile.stripe_customer_id,
            #     source=stripeToken,
            #     description='Good test'
            # )

            # create the payment
            payment = Payment()
            payment.stripe_charge_id = charge['id']
            payment.user = self.request.user
            payment.amount = order.get_total()
            payment.save()

            # assign the payment to the order

            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.save()

            order.ordered = True
            order.payment = payment
            # order.ref_code = create_ref_code()
            order.save()

            return Response(status=HTTP_200_OK)

        except stripe.error.CardError as e:
            body = e.json_body
            err = body.get('error', {})
            return Response({"message": f"{err.get('message')}"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            messages.warning(self.request, "Rate limit error")
            return Response({"message": "Rate limit error"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.InvalidRequestError as e:
            print(e)
            # Invalid parameters were supplied to Stripe's API
            return Response({"message": "Invalid parameters"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.AuthenticationError as e:
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            return Response({"message": "Not authenticated"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.APIConnectionError as e:
            # Network communication with Stripe failed
            return Response({"message": "Network error"}, status=HTTP_400_BAD_REQUEST)

        except stripe.error.StripeError as e:
            # Display a very generic error to the user, and maybe send
            # yourself an email
            return Response({"message": "Something went wrong. You were not charged. Please try again."}, status=HTTP_400_BAD_REQUEST)

        except Exception as e:
            # send an email to ourselves
            return Response({"message": "A serious error occurred. We have been notifed."}, status=HTTP_400_BAD_REQUEST)

        return Response({"message": "Invalid data received"}, status=HTTP_400_BAD_REQUEST)
# end stripe


class AddCouponView(APIView):
    def post(self, request, *args, **qwargs):
        code = request.data.get('code', None)   # get 'code' OR None !!!!
        if code is None:
            return Response({"message": "Invalid data received"}, status=HTTP_400_BAD_REQUEST)
        else:
            order = Order.objects.get(user=self.request.user, ordered=False)
            coupon = get_object_or_404(Coupon, code=code)
            order.coupon = coupon
            order.save()
            return Response(status=HTTP_200_OK)



# class MultiValueCharFilter(django_filters.BaseCSVFilter, django_filters.CharFilter):
#     def filter(self, qs, value):
#         # value is either a list or an 'empty' value
#         values = value or []
#         for value in values:
#             qs = super(MultiValueCharFilter, self).filter(qs, value)
#         return qs
#  class AND може бути корисний для пошуку тільки шуканих елементів в моделі.
#  other_marks = MultiValueCharFilter(field_name='other_marks__mark', lookup_expr='contains')
#  наприклад видасть результат для запиту http://localhost:8000/api/?other_marks=new,popular тільки тоді, коли товари мають ці два теги(mark)