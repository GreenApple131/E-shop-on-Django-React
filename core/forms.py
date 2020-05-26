from django.core.validators import RegexValidator
from django import forms


PAYMENT_CHOICES = (
	('S', 'Stripe'),
	('P', 'PayPal')
)

class CheckoutForm(forms.Form):
	first_name=forms.CharField()
	last_name=forms.CharField()
	phone_number=forms.CharField(
                 error_messages={'incomplete': 'Enter a phone number.'},
                 validators=[RegexValidator(r'^[0-9]+$', 'Enter a valid phone number.')],
            	 )
	email=forms.EmailField()
	# форма для вибору способу оплати: один з кружочків
	payment_option=forms.ChoiceField(
		widget=forms.RadioSelect(), choices=PAYMENT_CHOICES)

