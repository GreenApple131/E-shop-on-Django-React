// endpoints
// export const localhost = "https://eshop-django-react.herokuapp.com"
export const localhost = "http://127.0.0.1:8000"


const apiURL = "/api"

export const endpoint = `${localhost}${apiURL}`

export const mediaURL = `${localhost}/media/`

export const productListURL = `${endpoint}/products/`
export const productDetailURL = slug => `${endpoint}/products/${slug}/`
export const addToCartURL = `${endpoint}/add-to-cart/`
export const orderSummaryURL = `${endpoint}/order-summary/`
export const checkoutURL = `${endpoint}/checkout/`
export const addCouponURL = `${endpoint}/add-coupon/`

export const orderItemDeleteURL = id => `${endpoint}/order-items/${id}/delete/`
export const orderItemUpdateQuantityURL = `${endpoint}/order-item/update-quantity/`

