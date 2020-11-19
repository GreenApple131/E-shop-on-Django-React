from django.conf import settings
from django.db import models
from django.shortcuts import reverse
from multiselectfield import MultiSelectField


CATEGORY_CHOICES = (
	('Co', 'Coats'),
	('Ja', 'Jackets'),
	('S', 'Shirts'),
	('Ts', 'T-shirts'),
	('Sw', 'Sport wear'),
	('Sh', 'Shoes'),
	('Hat', 'Hats'),
	('Ow', 'Outwear')
)

CATEGORY_TYPES = (
	('Men', 'Men'),
	('Women', 'Women')
)

SIZE_CHOICES = (
	('XS', 'XS'),
	('S', 'S'),
	('M', 'M'),
	('L', 'L'),
	('XL', 'XL'),
	('XXL', 'XXL')
)



LABEL_CHOICES = (
	('O', 'ordinary'),
	('P', 'primary'),
	('S', 'secondary'),
	('D', 'danger')
)


class UserProfile(models.Model):
	user = models.OneToOneField(
		settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	stripe_customer_id = models.CharField(max_length=50, blank=True, null=True)
	one_click_purchasing = models.BooleanField(default=False)

	def __str__(self):
		return self.user.username


class Sizes(models.Model):
	name = models.CharField(max_length=20, default='size')
	size = models.CharField(max_length=30, blank=True)
	
	def __str__(self):
		return self.size


class OtherMarks(models.Model):
	mark = models.CharField(max_length=100, default='ordinary') # special option can be ordinary, special, new or something else for front filtering on landing

	def __str__(self):
		return self.mark


class Item(models.Model):
	title = models.CharField(max_length=100)
	price = models.FloatField()
	discount_price = models.FloatField(blank=True, null=True)
	category = models.CharField(
	    choices=CATEGORY_CHOICES, max_length=3, blank=False)
	category_type = models.CharField(
		choices=CATEGORY_TYPES, max_length=5, blank=False)
	label = models.CharField(choices=LABEL_CHOICES, max_length=1, default="P")
	slug = models.SlugField(max_length=200, unique=True) # auto generate slug into admin using @@@@prepopulated_fields={'slug': ('title',)}@@@@
	description = models.TextField(
	    max_length=5000, default="This is a test description. Write something about this product.")
	size = models.ManyToManyField(Sizes)
	other_marks = models.ManyToManyField(OtherMarks)
	image = models.ImageField()

	def __str__(self):
		return self.title

	def get_absolute_url(self):
		return reverse("core:product", kwargs={
			'slug': self.slug
		})

	def get_add_to_cart_url(self):
		return reverse("core:add-to-cart", kwargs={
			'slug': self.slug
		})

	def get_remove_from_cart_url(self):
		return reverse("core:remove-from-cart", kwargs={
			'slug': self.slug
		})


class Variation(models.Model):
	item = models.ForeignKey(Item, on_delete=models.CASCADE)
	name = models.CharField(max_length=50) # size, colour, amount of memory...

	class Meta:
		unique_together = (
			('item', 'name')
		)

	def __str__(self):
		return self.name


class ItemVariation(models.Model):
	variation = models.ForeignKey(Variation, on_delete=models.CASCADE)
	value = models.CharField(max_length=50) # size(S/M/L), colour(green/white)...
	attachment = models.ImageField(blank=True)

	class Meta:
		unique_together = (
			('variation', 'value')
		)

	def __str__(self):
		return self.value


class OrderItem(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	ordered = models.BooleanField(default=False)
	item = models.ForeignKey(Item, on_delete=models.CASCADE)
	item_variations = models.ManyToManyField(ItemVariation)
	item_size = models.ManyToManyField(Sizes)
	quantity = models.IntegerField(default=1)

	def __str__(self):
		return f"{self.quantity} of {self.item.title}"

	def get_total_quantity(self):
		return self.quantity

	def get_total_item_price(self):
		return self.quantity * self.item.price

	def get_total_discount_item_price(self):
		return self.quantity * self.item.discount_price

	def get_amount_saved(self):
		return self.get_total_item_price() - self.get_total_discount_item_price()

	def get_final_price(self):
		if self.item.discount_price:
			return self.get_total_discount_item_price()
		return self.get_total_item_price()


class Order(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	ref_code = models.CharField(max_length=20, blank=True, null=True, default='123')
	items = models.ManyToManyField(OrderItem)
	start_date = models.DateTimeField(auto_now_add=True)
	ordered_date = models.DateTimeField()
	ordered = models.BooleanField(default=False)
	billing_address = models.ForeignKey(
		'BillingAddress', related_name='billing_address', on_delete=models.SET_NULL, blank=True, null=True)
	payment = models.ForeignKey(
		'Payment', on_delete=models.SET_NULL, blank=True, null=True)
	coupon = models.ForeignKey(
		'Coupon', on_delete=models.SET_NULL, blank=True, null=True)
	being_delivered = models.BooleanField(default=False)
	received = models.BooleanField(default=False)
	refund_requested = models.BooleanField(default=False)
	refund_grunted = models.BooleanField(default=False)

	'''
	1. Itam added to cart
	2. Adding a billing address
	(failed checkout)
	3. Payment
	(Prepocessing, processing, packaging etc.)
	4. Being delivered (tracking)
	5. Received
	6. Refunds
	'''

	def __str__(self):
		return self.user.username

	def get_total(self):
		total = 0
		for order_item in self.items.all():
			total += order_item.get_final_price()
		if self.coupon:
			total -= self.coupon.amount
		return total


class BillingAddress(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	first_name = models.CharField(max_length=100)
	last_name = models.CharField(max_length=100)
	phone_number = models.CharField(max_length=100)
	email = models.CharField(max_length=100)
	city = models.CharField(max_length=100)
	delivery = models.CharField(max_length=100)

	def __str__(self):
		return self.user.username


class Payment(models.Model):
	stripe_charge_id = models.CharField(max_length=100)
	user = models.ForeignKey(settings.AUTH_USER_MODEL,
	                         on_delete=models.SET_NULL, blank=True, null=True)
	amount = models.FloatField()
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return '{} - {}'.format(self.user, self.amount)


class Coupon(models.Model):
	code = models.CharField(max_length=15)
	amount = models.FloatField(default='20')

	def __str__(self):
		return self.code


class Refund(models.Model):
	order = models.ForeignKey(Order, on_delete=models.CASCADE)
	reason = models.TextField()
	accepted = models.BooleanField(default=False)
	email = models.EmailField()

	def __str__(self):
		return f"{self.pk}" 
		# pk (the default lookup field in DRF)


def userprofile_receiver(sender, instance, created, *args, **kwargs):
    if created:
        userprofile = UserProfile.objects.create(user=instance)