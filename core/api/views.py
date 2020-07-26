from django.conf import settings
from django.utils import timezone
from django.shortcuts import render, get_object_or_404, redirect
from django.core.exceptions import ObjectDoesNotExist
import stripe


from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST

from core.models import Item, Order, OrderItem
from .serializers import ItemSerializer, OrderSerializer


class ItemListView(ListAPIView):
    permission_classes = (AllowAny, )
    serializer_class = ItemSerializer
    queryset = Item.objects.all()


class AddToCartView(APIView):
    def post(self, request, *args, **kwargs):
        slug = request.data.get('slug', None)
        if slug is None:
            return Response({"message": "Invalid request"}, status=HTTP_400_BAD_REQUEST)
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
            return Response({"message": "You do not have an active order"}, status=HTTP_400_BAD_REQUEST)


class CheckoutView(APIView):
    # def get(self):
    #     return Response(status=HTTP_200_OK)

    # def post(self, request, *args, **kwargs):
    #     return Response(status=HTTP_200_OK)

    def get(self, *args, **kwargs):
        # part for the coupon
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            # form
            form = CheckoutForm()

            context = {
                'form': form,
                'couponform': CouponForm(),  # перевірка купону формою
                'order': order,
                'DISPLAY_COUPON_FORM': True,
            }
            return render(self.request, 'checkout.html', context)

        except ObjectDoesNotExist:
            messages.warning(self.request, "You do not have an active order")
        return redirect('/')
        # end part for the coupon

    def post(self, *args, **kwargs):
        form = CheckoutForm(self.request.POST or NONE)
        try:
            order = Order.objects.get(user=self.request.user, ordered=False)
            # print(self.request.POST)  # в консолі показується вся інфа після підтвердження запиту
            if form.is_valid():
                first_name = form.cleaned_data.get('first_name')
                last_name = form.cleaned_data.get('last_name')
                phone_number = form.cleaned_data.get('phone_number')
                email = form.cleaned_data.get('email')
                city = form.cleaned_data.get('city')
                delivery = form.cleaned_data.get('delivery')
                # TODO: add functionality to this field!!!!!!!!!!!!
                # save_info = form.cleaned_data.get('save_info')
                payment_option = form.cleaned_data.get('payment_option')
                billing_address = BillingAddress(
                    user=self.request.user,
                    first_name=first_name,
                    last_name=last_name,
                    phone_number=phone_number,
                    email=email,
                    city=city,
                    delivery=delivery
                )
                billing_address.save()

                order.billing_address = billing_address
                # order.save()
                order.save(update_fields=["billing_address"])

                if payment_option == 'Stripe':
                    return redirect('core:payment', payment_option='stripe')

            elif payment_option == 'IPay':
                # !!!!!!!!!!!!!!!!!!!!!!!!!!!! TODO IPay !!!!!!!!!!!!!!!!!!
                return redirect('core:checkout-ipay')

            messages.warning(self.request, "Failed checkout")
            return redirect('core:checkout')

        except ObjectDoesNotExist:
            messages.warning(self.request, "You do not have an active order")
            return redirect('core:order-summary')


# stripe part
class PaymentView(APIView):
    def get(self, *args, **kwargs):
        order = Order.objects.get(user=self.request.user, ordered=False)
        if order.billing_address:
            context = {
                'order': order,
                'DISPLAY_COUPON_FORM': False,
            }
            return render(self.request, "payment.html", context)
        else:
            messages.warning(
                self.request, "You have not added a billing address")
            return redirect("core:checkout")

    # # should be post? maybe not
    def post(self, *args, **kwargs):
        domain_url = 'http://localhost:8000/payment/stripe/'
        stripe.api_key = settings.STRIPE_SECRET_KEY
        order = Order.objects.get(user=self.request.user, ordered=False)
        amount = int((order.get_total()) * 100)

        try:
            stripe_checkout_session = stripe.checkout.Session.create(
                success_url=domain_url +
                'success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=domain_url + 'cancelled/',
                payment_method_types=['card'],
                mode='payment',
                line_items=[
                    {
                        'name': 'Your Order',
                        'quantity': 1,
                        'currency': 'usd',
                                    'amount': amount,     # 200 = $2.00
                    }
                ]
            )

            # create the payment
            payment = Payment()
            payment.stripe_charge_id = stripe_checkout_session['id']
            payment.user = self.request.user
            payment.amount = order.get_total()
            payment.save()

            # assign thee payment to the order

            order_items = order.items.all()
            order_items.update(ordered=True)
            for item in order_items:
                item.save()

            order.ordered = True
            order.payment = payment
            order.ref_code = create_ref_code()
            order.save()

            # remove all from cart

            if order.billing_address:
                context = {
                    'order': order,
                    'DISPLAY_COUPON_FORM': False,
                    'STRIPE_PUBLISHABLE_KEY': settings.STRIPE_PUBLISHABLE_KEY
                }

            messages.success(self.request, "Your order was successful!")
            return redirect("/")

        except stripe.error.CardError as e:
            body = e.json_body
            err = body.get('error', {})
            messages.warning(self.request, f"{err.get('message')}")
            return redirect("/")

        except stripe.error.RateLimitError as e:
            # Too many requests made to the API too quickly
            messages.warning(self.request, "Rate limit error")
            return redirect("/")

        except stripe.error.InvalidRequestError as e:
            # Invalid parameters were supplied to Stripe's API
            print(e)
            messages.warning(self.request, "Invalid parameters")
            return redirect("/")

        except stripe.error.AuthenticationError as e:
            # Authentication with Stripe's API failed
            # (maybe you changed API keys recently)
            messages.warning(self.request, "Not authenticated")
            return redirect("/")

        except stripe.error.APIConnectionError as e:
            # Network communication with Stripe failed
            messages.warning(self.request, "Network error")
            return redirect("/")

        except stripe.error.StripeError as e:
            # Display a very generic error to the user, and maybe send
            # yourself an email
            messages.warning(
                self.request, "Something went wrong. You were not charged. Please try again.")
            return redirect("/")

        except Exception as e:
            # send an email to ourselves
            messages.warning(
                self.request, "A serious error occurred. We have been notifed.")
            return redirect("/")
        messages.warning(self.request, "Invalid data received")
        return redirect('/payment/stripe/')
# end stripe
