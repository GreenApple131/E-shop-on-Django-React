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
import stripe

from .models import Item, OrderItem, Order, BillingAddress
from .forms import CheckoutForm



def product(request):

	context = {
		'items': Item.objects.all()
	}
	return render(request, "product.html", context)


class CheckoutView(LoginRequiredMixin, View):
	def get(self, *args, **kwargs):
		try:
			order = Order.objects.get(user=self.request.user, ordered=False)
			# form
			form = CheckoutForm()

			context = {
				'object': order,
				'form': form,
			}
			return render(self.request, 'checkout.html', context)
		except ObjectDoesNotExist:
			messages.error(self.request, "You do not have an active order")
			return redirect('/')

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
				#TODO: add functionality to this field!!!!!!!!!!!!
				# save_info = form.cleaned_data.get('save_info')
				payment_option = form.cleaned_data.get('payment_option')
				billing_address = BillingAddress(
					user=self.request.user,
					first_name=first_name,
					last_name=last_name,
					phone_number=phone_number,
					email=email,
					city=city,
					delivery=delivery,
				)
				billing_address.save()
				order.billing_address=billing_address
				order.save()
				#TODO: add redirect to the selected payment option  !!!!!!
				return redirect('core:checkout')
			messages.warning(self.request, "Failed checkout")
			return redirect('core:checkout')

		except ObjectDoesNotExist:
			messages.error(self.request, "You do not have an active order")
			return redirect('core:order-summary')




# stripe part
class PaymentView(View):
	def get(self, *args, **kwargs):
		return render(self.request, 'payment.html')		


@csrf_exempt
def stripe_config(request):
    if request.method == 'GET':
        stripe_config = {'publicKey': settings.STRIPE_PUBLISHABLE_KEY}
        return JsonResponse(stripe_config, safe=False)

@csrf_exempt
def create_checkout_session(request):
    if request.method == 'GET':
        domain_url = 'http://localhost:8000/stripe/'
        stripe.api_key = settings.STRIPE_SECRET_KEY
        try:
            # Create new Checkout Session for the order
            # Other optional params include:
            # [billing_address_collection] - to display billing address details on the page
            # [customer] - if you have an existing Stripe Customer ID
            # [payment_intent_data] - lets capture the payment later
            # [customer_email] - lets you prefill the email input in the form
            # For full details see https:#stripe.com/docs/api/checkout/sessions/create

            # ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
            checkout_session = stripe.checkout.Session.create(
                success_url=domain_url + 'success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url=domain_url + 'cancelled/',
                payment_method_types=['card'],
                mode='payment',
                line_items=[
                    {
                        'name': 'Your Order',
                        'quantity': 3,
                        'currency': 'usd',
                        'amount': '100',     # 200 = $2.00
                    }
                ]
            )
            return JsonResponse({'sessionId': checkout_session['id']})
        except Exception as e:
            return JsonResponse({'error': str(e)})

class SuccessView(TemplateView):
    template_name = 'stripe/success.html'


class CancelledView(TemplateView):
    template_name = 'stripe/cancelled.html'
# end stripe

def home(request):

	context = {
		'items': Item.objects.all()
	}
	return render(request, "home.html", context)	


class HomeView(ListView):
	model = Item
	paginate_by = 10
	template_name = "home.html"


class OrderSummaryView(LoginRequiredMixin, View):   # LoginRequiredMixin перекидає на сторінку входу/реєстрації
	def get(self, *args, **kwargs):
		try:
			order = Order.objects.get(user=self.request.user, ordered=False)
			context = {
				'object': order
			}
			return render(self.request, 'order_summary.html', context)
		except ObjectDoesNotExist:
			messages.error(self.request, "You do not have an active order")
			return redirect('/')


class ItemDetailView(DetailView):
	model = Item
	template_name = "product.html"


@login_required
def add_to_cart(request, slug):
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
			messages.info(request, "This item quantity was updated.")
			return redirect("core:order-summary")
		else:
			order_item.quantity == 0
			messages.info(request, "This item was added to your cart.")
			order.items.add(order_item)
			return redirect("core:order-summary")
	else:
		ordered_date = timezone.now()
		order = Order.objects.create(user=request.user, ordered_date=ordered_date)
		order.items.add(order_item)
		messages.info(request, "This item was added to your cart.")
	return redirect("core:order-summary")


@login_required
def remove_from_cart(request, slug):
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
				order_item.quantity = 1
				order_item.save()
				order.items.remove(order_item)
			else:
				order.items.remove(order_item)
			messages.info(request, "This item was removed from your cart.")
			return redirect("core:order-summary")
		else:
			messages.info(request, "This item was not in your cart")
			return redirect("core:product", slug=slug)
	else:
		messages.info(request, "You do not have an active order")
		return redirect("core:product", slug=slug)


@login_required
def remove_single_item_from_cart(request, slug):
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
				order.items.remove(order_item)
			messages.info(request, "This item quantity was updated.")
			return redirect("core:order-summary")
		else:
			messages.info(request, "This item was not in your cart")
			return redirect("core:product", slug=slug)
	else:
		messages.info(request, "You do not have an active order")
		return redirect("core:product", slug=slug)