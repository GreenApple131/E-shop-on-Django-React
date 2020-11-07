import union from "lodash/union";
import intersection from "lodash/intersection";

/**
 * Combine individual filters by the optionType as a key
 * Used for render
 *
 * @param {Array} filters Array of filter objects
 */
export const combineFiltersByOptionType = (filters) => {
  return filters.reduce((combined, filterItem) => {
    let obj = {
      id: filterItem.id,
      active: filterItem.active,
      count: filterItem.count,
      optionValue: filterItem.optionValue
    };
    combined[filterItem.optionType] = combined[filterItem.optionType] || {};
    combined[filterItem.optionType].options =
      combined[filterItem.optionType].options || [];
    combined[filterItem.optionType].options.push(obj);
    combined[filterItem.optionType].name = filterItem.name;
    return combined;
  }, Object.create(null));
};

export const getFilteredProducts = (inputFilters, inputProducts) => {
  let products = [];
  let filters = [];
  if (isAnyActive(inputFilters)) {
    products = getActiveProducts(inputFilters, inputProducts);
  } else {
    products = inputProducts;
  }
  filters = getFilters(inputFilters, inputProducts);
  return { products, filters };
};

const setProductsSKU = (inputFilters, inputProducts) => {
  for (let index = 0; index < inputFilters.length; index++) {
    let filter = inputFilters[index];
    filter.products = getProductsSKU(inputProducts, filter);
  }
};

const getProductsSKU = (inputProducts, filter) => {
  let skus = [];
  for (let index = 0; index < inputProducts.length; index++) {
    const product = inputProducts[index];
    if (isFilterValueInProduct(product, filter)) {
      if (product.sku) {
        skus.push(product.sku);
      }
    }
  }
  return skus;
};

const isFilterValueInProduct = (product, filter) => {
  const keys = Object.keys(product);
  if (keys.includes(filter.optionType)) {
    return product[filter.optionType].some((option) => {
      return filter.optionValue === option.value;
    });
  }
  return false;
};

const getActiveFilters = (filters) => {
  let activeFilters = {};
  for (let index = 0; index < filters.length; index++) {
    const filter = filters[index];
    if (filter.active) {
      activeFilters[filter.optionType] = activeFilters[filter.optionType] || {};
      activeFilters[filter.optionType].products = union(
        activeFilters[filter.optionType].products,
        filter.products
      );
    }
  }
  return activeFilters;
};

/**
 * Flatten products from activeFilters object
 * @param {Object} activeFilters Active filters object
 */
const transformActiveProducts = (activeFilters) => {
  return Object.keys(activeFilters).reduce((result, key) => {
    let filter = activeFilters[key];
    return [...result, filter.products];
  }, []);
};

const getActiveProductsCount = (inputFilters, inputProducts, filter) => {
  let time0 = performance.now();
  setProductsSKU(inputFilters, inputProducts);

  let activeFilters = getActiveFilters(inputFilters);
  let transformedProducts = transformActiveProducts(activeFilters);
  let activeProducts = intersection(...transformedProducts);
  let counter = 0;
  let found = inputFilters.find((inputFilter) => {
    return inputFilter.optionValue === filter.optionValue;
  });
  if (found) {
    let intersect = intersection(activeProducts, found.products);
    counter = intersect.length;
  }
  let time1 = performance.now();
  //console.log(`Function 'setProductsSKU' Took ${time1 - time0}ms`)
  return counter;
};

const getActiveProducts = (inputFilters, inputProducts) => {
  setProductsSKU(inputFilters, inputProducts);
  let activeFilters = getActiveFilters(inputFilters);
  let transformedProducts = transformActiveProducts(activeFilters);
  let activeProducts = intersection(...transformedProducts);
  let products = inputProducts.filter((product) => {
    return activeProducts.includes(product.sku);
  });
  return products;
};

const getFilters = (inputFilters, inputProducts) => {
  let filters = [];
  for (let index = 0; index < inputFilters.length; index++) {
    let filter = inputFilters[index];
    if (filter.active) {
      filter.count = getActiveProductsCount(
        inputFilters,
        inputProducts,
        filter
      );
    } else {
      filter.active = true;
      filter.count = getActiveProductsCount(
        inputFilters,
        inputProducts,
        filter
      );
      filter.active = false;
    }
    filters.push(filter);
  }
  return filters;
};

const isAnyActive = (filters) => {
  return filters.some((filter) => filter.active);
};
