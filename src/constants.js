// endpoints
// export const localhost = "https://eshop-django-react.herokuapp.com"
export const localhost = "http://127.0.0.1:8000";

const apiURL = "/api";

export const endpoint = `${localhost}${apiURL}`;

export const mediaURL = `${localhost}/media/`;

export const productListURL = `${endpoint}/i/items/`;
export const productListLimPriceURL = (min_price, max_price) =>
  `${endpoint}/?min_price=${
    min_price === undefined ? (min_price = 0) : min_price
  }&max_price=${max_price === undefined ? (max_price = 9999999) : max_price}`;
export const productListCategoryURL = (category) =>
  `${endpoint}/?category=${category}`;
export const productSearchURL = (searchRequest) =>
  `${endpoint}/search/?search=${searchRequest}`;
export const productDetailURL = (slug) => `${endpoint}/products/${slug}/`;
export const addToCartURL = `${endpoint}/add-to-cart/`;
export const orderSummaryURL = `${endpoint}/order-summary/`;
export const checkoutURL = `${endpoint}/checkout/`;
export const addCouponURL = `${endpoint}/add-coupon/`;

export const orderItemDeleteURL = (id) =>
  `${endpoint}/order-items/${id}/delete/`;
export const orderItemUpdateQuantityURL = `${endpoint}/order-item/update-quantity/`;

// Filters and ordering
export const productFilterAndOrderURL = (
  category,
  price_min,
  price_max,
  other_marks,
  ordering,
  page,
) =>
  `${endpoint}/?
${"category=" + category}
${price_min === undefined ? (price_min = "") : "&price_min=" + price_min}
${price_max === undefined ? (price_max = "") : "&price_max=" + price_max}
${
  other_marks === undefined ? (other_marks = "") : "&other_marks=" + other_marks
}
${ordering === undefined ? (ordering = "") : "&ordering=" + ordering}
${page === undefined ? (page = "") : "&page=" + page}
`;

export const categories = [
  'Jackets',
  'Coats',
  'Hats',
  'Outwear',
  'Shirts',
  'Shoes',
  'T-shirts',
  'Sport-wear',
];

export const orderingOptions = [
  {
    key: "price",
    text: "increasing price",
    value: "price",
  },
  {
    key: "-price",
    text: "decreasing price",
    value: "-price",
  },
  {
    key: "title",
    text: "increasing name",
    value: "title",
  },
  {
    key: "-title",
    text: "decreasing name",
    value: "-title",
  },
];
