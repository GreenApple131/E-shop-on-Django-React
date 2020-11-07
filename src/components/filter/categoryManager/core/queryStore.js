import qs from "qs";
import cloneDeep from "lodash/cloneDeep";
// import { navigate } from "gatsby"
import { SORT_TYPES } from "./sortReducer";

const encodeObjUrl = obj =>
  qs.stringify(obj, { encode: true, encodeValuesOnly: true });

const decodeObjString = str => qs.parse(str);

const setURLQuery = query => {
  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    query;

  window.history.pushState({ path: newurl }, "", newurl);
  // // const { pathname } = location;
  // // let url = pathname;
  // if (query !== "") {
  //   url = url + "?" + query;
  // }
  // // navigate(url)
  // window.history.pushState(url);
};

export const storeQuery = ({
  filters,
  sortBy,
  priceRange,
  showOffers,
  currentPage,
  productsPerPage,
  initialState
}) => {
  let activeFilters = filters.filter(filter => filter.active);
  let queryObject = activeFilters.reduce((transformed, filter) => {
    transformed[filter.optionType] = transformed[filter.optionType] || [];
    transformed[filter.optionType].push(filter.optionValue);
    return transformed;
  }, {});

  if (initialState.showOffers !== showOffers) {
    queryObject = {
      ...queryObject,
      offers: showOffers
    };
  }
  if (initialState.currentPage !== currentPage) {
    queryObject = {
      ...queryObject,
      page: currentPage
    };
  }
  if (initialState.sortBy !== sortBy) {
    queryObject = {
      ...queryObject,
      sort: sortBy
    };
  }

  if (
    initialState.initialPriceRange[0] !== priceRange[0] ||
    initialState.initialPriceRange[1] !== priceRange[1]
  ) {
    queryObject = {
      ...queryObject,
      priceRange: {
        min: priceRange[0],
        max: priceRange[1]
      }
    };
  }

  if (initialState.productsPerPage !== productsPerPage) {
    queryObject = {
      ...queryObject,
      productsPerPage
    };
  }

  let encoded = encodeObjUrl(queryObject);
  setURLQuery(encoded);
};

export const decodeQuery = initialState => {
  let query = window.location.search;

  let state = cloneDeep(initialState);
  let filters = [...state.filters];
  if (query) {
    query = query.substring(1);
    let decoded = decodeObjString(query);
    for (const [key, value] of Object.entries(decoded)) {
      if (key === "page") {
        state.selectedPage = parseInt(value);
      } else if (key === "productsPerPage") {
        state.productsPerPage = parseInt(value);
      } else if (key === "sort" && SORT_TYPES[value]) {
        state.sortBy = value;
      } else if (key === "offers") {
        state.showOffers = value === "true" ? true : false;
      } else if (key === "priceRange") {
        let min = parseInt(value.min);
        let max = parseInt(value.max);
        state.priceRange = [min, max];
      } else {
        filters = filters.map(filter => {
          if (filter.optionType === key && value.includes(filter.optionValue)) {
            filter.active = true;
          }
          return filter;
        });
      }
    }
    state.filters = filters;
  }

  return state;
};
