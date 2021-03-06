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
import string, random
import stripe
from core.api.CRUD_products import crud_products

from .models import Item, OrderItem, Order, BillingAddress, Payment, Coupon, Refund
from .forms import CheckoutForm, CouponForm, RefundForm



def create_ref_code():
	return ''.join(random.choices(string.ascii_lowercase + string.digits, k=20))


def product(request):
	context = {
		'items': Item.objects.all()
	}
	return render(request, "product.html", context)


def is_valid_form(values):
    valid = True
    for field in values:
        if field == '':
            valid = False
    return valid
	

class CheckoutView(LoginRequiredMixin, View):
	def get(self, *args, **kwargs):
		# part for the coupon
		try:
			order = Order.objects.get(user=self.request.user, ordered=False)
			# form
			form = CheckoutForm()

			context = {
				'form': form,
				'couponform': CouponForm(), # перевірка купону формою
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
class PaymentView(View):
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
			domain_url = 'https://eshop-django-react.herokuapp.com/payment/stripe/'
			stripe.api_key = settings.STRIPE_SECRET_KEY
			order = Order.objects.get(user=self.request.user, ordered=False)
			amount = int((order.get_total()) * 100)


			try:
				stripe_checkout_session = stripe.checkout.Session.create(
					success_url=domain_url + 'success?session_id={CHECKOUT_SESSION_ID}',
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
						'STRIPE_PUBLISHABLE_KEY' : settings.STRIPE_PUBLISHABLE_KEY
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
			messages.warning(self.request, "You do not have an active order")
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
			order.items.remove(order_item)
			order_item.delete()
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


def get_coupon(request, code):
	try:
		coupon = Coupon.objects.get(code=code)
		return coupon

	except ObjectDoesNotExist:
		messages.info(request, "This coupon does not exists")
		return redirect('code:checkout')



class AddCupounView(View):
	def post(self, *args, **qwargs):
		form = CouponForm(self.request.POST or None)
		if form.is_valid():
			try:
				code = form.cleaned_data.get('code')
				order = Order.objects.get(user=self.request.user, ordered=False)
				order.coupon = get_coupon(self.request, code)
				order.save()
				messages.success(self.request, "Successfully added coupon")
				return redirect("core:checkout")


			except ObjectDoesNotExist:
				messages.info(self.request, "You do not have an active order")
				return redirect('code:checkout')


class RequestRefundView(View):
	def get(self, *args, **qwargs):
		form = RefundForm()
		context = {
			'form': form
		}

		return render(self.request, "request_refund.html", context)


	def post(self, *args, **qwargs):
		form = RefundForm(self.request.POST)
		if form.is_valid():
			ref_code = form.cleaned_data.get('ref_code')
			message = form.cleaned_data.get('message')
			email = form.cleaned_data.get('email')
			# edit the order
			try:
				order = Order.objects.get(ref_code=ref_code)
				order.refund_requested = True   # перевірка чи збігається введений код товару з якимось у базі
				order.save()

				# store the refund
				refund = Refund()
				refund.order = order
				refund.reason = message
				refund.email = email
				refund.save()

				messages.info(self.request, "Your request is received")
				return redirect('core:request-refund')

			except ObjectDoesNotExist:
				messages.info(self.request, "This order does not exist")
				return redirect('core:request-refund')
		else:
			messages.info(self.request, "The form is invalid")
			return redirect('core:request-refund')