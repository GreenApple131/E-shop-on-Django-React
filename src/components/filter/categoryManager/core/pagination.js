export const getPaginatedProducts = (
    products,
    selectedPage,
    productsPerPage
  ) => {
    let pageOffset = selectedPage * productsPerPage
    return products.slice(pageOffset, pageOffset + productsPerPage)
  }
  
  export const getPageCount = (products, productsPerPage) => {
    if (products.length > 0) {
      return Math.ceil(products.length / productsPerPage)
    }
    return 1
  }
  