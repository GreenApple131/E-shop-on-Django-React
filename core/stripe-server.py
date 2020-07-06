# Set your secret key. Remember to switch to your live secret key in production!
# See your keys here: https://dashboard.stripe.com/account/apikeys
stripe.api_key = 'sk_test_51H1x1XK0Ldnw408vNVMO4DeIGzr5V6wb2cP0LXXgdVQJU6UeuajbDKqXMSSt5UuiuETcydLUclIIfjKIqn50c0s1001XzmU8J6'

stripe.PaymentIntent.create(
  amount=1099,
  currency='usd',
  customer=customer['id'],
)