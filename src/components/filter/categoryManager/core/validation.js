export const isAnyFilterActive = (initialState, currentState) => {
    let activeFilter = currentState.filters.some(filter => filter.active)
    if (activeFilter) {
      return true
    }
    if (initialState.showOffers !== currentState.showOffers) {
      return true
    }
    if (initialState.sortBy !== currentState.sortBy) {
      return true
    }
    if (initialState.currentPage !== currentState.currentPage) {
      return true
    }
    if (initialState.productsPerPage !== currentState.productsPerPage) {
      return true
    }
    if (
      initialState.initialPriceRange[0] !== currentState.priceRange[0] ||
      initialState.initialPriceRange[1] !== currentState.priceRange[1]
    ) {
      return true
    }
    return false
  }
  