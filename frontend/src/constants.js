// endpoints
export const localhost = "http://127.0.0.1:8000"

const apiURL = "/api"

export const endpoint = `${localhost}${apiURL}`

export const mediaURL = `${localhost}/media/`

export const productListURL = `${endpoint}/products/`
export const productDetailURL = id => `${endpoint}/products/${id}/`
export const addToCartURL = `${endpoint}/add-to-cart/`
export const orderSummaryURL = `${endpoint}/order-summary/`
export const checkoutURL = `${endpoint}/checkout/`
export const addCouponURL = `${endpoint}/add-coupon/`

export const orderItemDeleteURL = id => `${endpoint}/order-items/${id}/delete/`

