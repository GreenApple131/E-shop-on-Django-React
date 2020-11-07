export const getProductsByOffer = (inputProducts, showOffers) => {
    if (!showOffers) return inputProducts
    let productsByOffer = inputProducts.filter(product => {
      return product.offer
    })
    return productsByOffer.length > 0 ? productsByOffer : inputProducts
  }
  