import React, { useEffect, useState, Component } from "react";
import faker from "faker";
import _ from "lodash";
import { connect, Provider } from "react-redux";
// import { render } from "react-dom";
// import { combineReducers, createStore } from "redux";
// import _ from "lodash";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  Header,
  Loader,
  Rail,
  Ref,
  Segment,
  Sticky,
  Table,
} from "semantic-ui-react";
import CategoryFilter from "./CategoryFilter";
import {
  addToCartURL,
  productListURL,
  productFilterAndOrderURL,
  productListCategoryURL,
} from "../constants";
import { authAxios } from "../utils";
import { fetchCart } from "../store/actions/cart";
import { ItemsCards } from "./ElementsCard";

// import "./elements/filters.scss";
import "./elements/filter.css";

function TestFilter(props) {
  const [filterstate, setFilterstate] = useState({
    filters: [],
    multipleCategories: "",
  });
  const [state, setState] = useState({
    data: [],
    category: "",
    price_min: undefined,
    price_max: undefined,
    other_marks: undefined,
    ordering: "price",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(
        productFilterAndOrderURL(
          filterstate.multipleCategories,
          state.price_min,
          state.price_max,
          state.other_marks,
          state.ordering
        )
      )
      // .get(productListCategoryURL(category))
      .then((res) => {
        console.log("TestFilter", res.data.results);
        // const itemsFixedPrice = res.data.results.map((pr) => {
        //   pr.price = pr.price.toString();
        //   return pr;
        // });
        setState((prevState) => ({
          ...prevState,
          data: res.data.results,
        }));
      })
      .catch((err) => {
        setError(err);
      });

    console.log("state", state);
    console.log("filterstate", filterstate);
  }, [filterstate.multipleCategories]);

  useEffect(() => {
    let fixedFilter = "";
    for (const [key, value] of Object.entries(filterstate.filters)) {
      // const fixedFilter = Object.entries(filterstate.filters)
      if (value === true) {
        fixedFilter += `${key}` + ",";
        setFilterstate((prevState) => ({
          ...prevState,
          multipleCategories: fixedFilter,
        }));
      } else {
        fixedFilter += "";
        setFilterstate((prevState) => ({
          ...prevState,
          multipleCategories: fixedFilter,
        }));
      }
    }
    console.log("fixedFilter", fixedFilter);
  }, [filterstate.filters]);

  const checkboxChange = (e) => {
    const { name } = e.target;
    setFilterstate((prevState) => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [name]: !prevState.filters[name],
      },
    }));
  };

  return (
    <React.Fragment>
      {/* categoryChoose={this.props.location.state.searchValue} */}
      <Container style={{ marginTop: "10px" }}>
        <React.Fragment>
          <Header
            style={{
              margin: 10,
              fontFamily: "monospace",
              fontSize: 30,
              marginTop: "30px",
              marginBottom: "10px",
            }}
          >
            Categories
          </Header>
          <div>
            <div>
              <input
                className="mr-2"
                checked={filterstate.filters.index}
                name="Jackets"
                value="Jackets"
                onChange={checkboxChange}
                type="checkbox"
              />{" "}
              Jackets
            </div>
            <div>
              <input
                className="mr-2"
                checked={filterstate.filters.index}
                label="Coats"
                name="Coats"
                value="Coats"
                onChange={checkboxChange}
                type="checkbox"
              />{" "}
              Coats
            </div>
            <div>
              <input
                className="mr-2"
                checked={filterstate.filters.index}
                label="Hats"
                name="Hats"
                value="Hats"
                onChange={checkboxChange}
                type="checkbox"
              />{" "}
              Hats
            </div>
            <div>
              <input
                className="mr-2"
                checked={filterstate.filters.index}
                label="Outwear"
                name="Outwear"
                value="Outwear"
                onChange={checkboxChange}
                type="checkbox"
              />{" "}
              Outwear
            </div>
            <div>
              <input
                className="mr-2"
                checked={filterstate.filters.index}
                label="Shirts"
                name="Shirts"
                value="Shirts"
                onChange={checkboxChange}
                type="checkbox"
              />{" "}
              Shirts
            </div>
            <div>
              <input
                className="mr-2"
                checked={filterstate.filters.index}
                label="Shoes"
                name="Shoes"
                value="Shoes"
                onChange={checkboxChange}
                type="checkbox"
              />{" "}
              Shoes
            </div>
            <div>
              <input
                className="mr-2"
                checked={filterstate.filters.index}
                label="T-shirts"
                name="T-shirts"
                value="T-shirts"
                onChange={checkboxChange}
                type="checkbox"
              />{" "}
              T-shirts
            </div>
            <div>
              <input
                className="mr-2"
                checked={filterstate.filters.index}
                label="Sport-wear"
                name="Sport-wear"
                value="Sport-wear"
                onChange={checkboxChange}
                type="checkbox"
              />{" "}
              Sport-wear
            </div>
          </div>

          <Divider />
          {/* <ItemsCards data={data} /> */}
        </React.Fragment>

        <Divider />
        <ItemsCards data={state.data} />
      </Container>

      <CategoryFilter />
    </React.Fragment>
  );
}

export default TestFilter;
// export default connect(null, mapDispatchToProps)(TestFilter);
