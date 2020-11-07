import React, { Component } from "react";
import { products as initialProducts } from "./json/products";
import { filters as initialFilters } from "./json/filters";

import CategoryManager from "./filter/categoryManager/categoryManager";
import PriceRange from "./filter/priceRange";
import ClearFiltersButton from "./filter/clearFiltersButton";
import SortSwitch from "./filter/sortSwitch";
import ToggleOffersButton from "./filter/toggleOffersButton";
import Pagination from "./filter/pagination";
import ProductsPerPageSwitch from "./filter/productsPerPageSwitch";

import Filters from "./filter/filters";
import Products from "./filter/products";
import moment from "moment";

import "./elements/example.css"

class CategoryFilter extends Component {
    render() {
      let beginningTime = moment();
      let endTime = moment({
        h: 13,
        m: 0
      });
      if (beginningTime.isBefore(endTime)) {
        console.log("Before 15");
      } else {
        console.log("After 15");
      }
      return (
        <CategoryManager
          products={initialProducts}
          filters={initialFilters}
          {...this.props}
        >
          <div
            style={{
              display: `flex`,
              margin: `50px auto`,
              justifyContent: `space-between`,
              width: `800px`,
              fontSize: `18px`
            }}
          >
            <div style={{ minWidth: `200px`, padding: `0 40px` }}>
              <ClearFiltersButton />
              <ToggleOffersButton />
              <PriceRange />
              <Filters />
            </div>
            <div>
              <SortSwitch />
              <ProductsPerPageSwitch />
              <Products />
            </div>
          </div>
          <Pagination />
        </CategoryManager>
      );
    }
  }
  

  export default CategoryFilter;