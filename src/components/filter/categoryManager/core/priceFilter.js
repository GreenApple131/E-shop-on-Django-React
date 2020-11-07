export const getInitialPriceRange = products => {
    let max = 0
    let min = 0
    products.forEach(product => {
      max = product.price > max ? product.price : max
      min = product.price < min ? product.price : min
    })
    return [min, max]
  }
  
  export const filterProductsByPrice = (priceRange, products) => {
    const [min, max] = priceRange
    return products.filter(product => {
      return product.price >= min && product.price <= max
    })
  }
  