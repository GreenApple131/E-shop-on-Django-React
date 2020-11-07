const SORT_BY_RELEVANCE = "SORT_BY_RELEVANCE"
const SORT_BY_NEWEST = "SORT_BY_NEWEST"
const SORT_BY_OLDEST = "SORT_BY_OLDEST"
const SORT_BY_PRICE_ASC = "SORT_BY_PRICE_ASC"
const SORT_BY_PRICE_DESC = "SORT_BY_PRICE_DESC"
const SORT_BY_TITLE_ASC = "SORT_BY_TITLE_ASC"
const SORT_BY_TITLE_DESC = "SORT_BY_TITLE_DESC"

export const SORT_TYPES = {
  SORT_BY_RELEVANCE,
  SORT_BY_NEWEST,
  SORT_BY_OLDEST,
  SORT_BY_PRICE_ASC,
  SORT_BY_PRICE_DESC,
  SORT_BY_TITLE_ASC,
  SORT_BY_TITLE_DESC,
}

/*

SORT_BY_NEWEST Newest
SORT_BY_OLDEST Oldest
SORT_BY_PRICE_ASC Price (Low to High)
SORT_BY_PRICE_DESC Price (High to Low)
SORT_BY_TITLE_ASC Name A-Z
SORT_BY_TITLE_DESC Name Z-A
    
*/
export const sortProducts = (products = [], sortBy = SORT_BY_RELEVANCE) => {
  switch (sortBy) {
    case SORT_BY_RELEVANCE:
      return products
    case SORT_BY_NEWEST:
      return products.sort(sortByDateASC)
    case SORT_BY_OLDEST:
      return products.sort(sortByDateDESC)
    case SORT_BY_PRICE_ASC:
      return products.sort(sortByPriceASC)
    case SORT_BY_PRICE_DESC:
      return products.sort(sortByPriceDESC)
    case SORT_BY_TITLE_ASC:
      return products.sort(sortByTitleASC)
    case SORT_BY_TITLE_DESC:
      return products.sort(sortByTitleDESC)
    default:
      return products
  }
}

const sortByTitleASC = (a, b) => {
  let titleA = a.title.toLowerCase()
  let titleB = b.title.toLowerCase()
  return titleA > titleB ? 1 : titleB > titleA ? -1 : 0
}

const sortByTitleDESC = (a, b) => {
  let titleA = a.title.toLowerCase()
  let titleB = b.title.toLowerCase()
  return titleA > titleB ? -1 : titleB > titleA ? 1 : 0
}

const sortByPriceASC = (a, b) => {
  return parseFloat(a.price) - parseFloat(b.price)
}

const sortByPriceDESC = (a, b) => {
  return parseFloat(b.price) - parseFloat(a.price)
}

// Date format YYYY-MM-DD
const sortByDateASC = (a, b) => {
  let dateA = new Date(a.date)
  let dateB = new Date(b.date)
  return dateB - dateA
}

const sortByDateDESC = (a, b) => {
  let dateA = new Date(a.date)
  let dateB = new Date(b.date)
  return dateA - dateB
}
