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
  Input,
  Label,
  Loader,
  Rail,
  Ref,
  Segment,
  Select,
  Sticky,
  Table,
} from "semantic-ui-react";
import { Slider, InputNumber } from "antd";
import "antd/dist/antd.css";
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


const orderingOptions = [
  {
    key: 'price',
    text: 'increasing price',
    value: 'price'
  },
  {
    key: '-price',
    text: 'decreasing price',
    value: '-price'
  },
  {
    key: 'title',
    text: 'increasing name',
    value: 'title'
  },
  {
    key: '-title',
    text: 'decreasing name',
    value: '-title'
  },
]

function TestFilter(props) {
  const [filterstate, setFilterstate] = useState({
    filters: [],
    multipleCategories: "",
  });
  const [state, setState] = useState({
    data: [],
    category: "",
    price_min: 0,
    price_max: 200,
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
  }, [filterstate.multipleCategories, state.price_min, state.price_max, state.ordering]);

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

  const onCheckboxChange = (e) => {
    const { name } = e.target;
    setFilterstate((prevState) => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [name]: !prevState.filters[name],
      },
    }));
  };

  const onPriceChange = (value) => {
    if (value[0] < value[1]) {
      setState((prevState) => ({
        ...prevState,
        price_min: value[0],
        price_max: value[1],
      }));
    }
  };

  const onPriceChangeMin = (value) => {
    if (state.price_max > value) {
      setState((prevState) => ({ ...prevState, price_min: value }));
    }
  };
  const onPriceChangeMax = (value) => {
    if (state.price_min < value) {
      setState((prevState) => ({ ...prevState, price_max: value }));
    }
  };

  const onOrderingChange = (e, {value}) => {
    setState((prevState) => ({
      ...prevState,
      ordering: value
    }))
  }

  return (
    <React.Fragment>
      {/* categoryChoose={this.props.location.state.searchValue} */}
      <Container style={{ marginTop: "10px" }}>
        <React.Fragment>
          <Grid columns={3} divided>
            <Grid.Row>
              <Grid.Column>
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
                      onChange={onCheckboxChange}
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
                      onChange={onCheckboxChange}
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
                      onChange={onCheckboxChange}
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
                      onChange={onCheckboxChange}
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
                      onChange={onCheckboxChange}
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
                      onChange={onCheckboxChange}
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
                      onChange={onCheckboxChange}
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
                      onChange={onCheckboxChange}
                      type="checkbox"
                    />{" "}
                    Sport-wear
                  </div>
                </div>
              </Grid.Column>
              <Grid.Column>
                <Header
                  style={{
                    margin: 10,
                    fontFamily: "monospace",
                    fontSize: 30,
                    marginTop: "30px",
                    marginBottom: "10px",
                  }}
                >
                  Price
                </Header>
                <React.Fragment>
                  <Slider
                    className="slider-main-div"
                    min={0}
                    max={200}
                    onChange={onPriceChange}
                    range={true}
                    defaultValue={[state.price_min, state.price_max]}
                    value={[state.price_min, state.price_max]}
                  />
                  <div className="range-input-number-main">
                    <InputNumber
                      className="min-input-main"
                      min={0}
                      max={200}
                      value={state.price_min}
                      onChange={onPriceChangeMin}
                    />
                    <span className="range-span"> to </span>
                    <InputNumber
                      className="min-input-main"
                      min={0}
                      max={200}
                      value={state.price_max}
                      onChange={onPriceChangeMax}
                      onStep="false"
                    />
                  </div>
                </React.Fragment>
              </Grid.Column>
              <Grid.Column>
                <Header
                  style={{
                    margin: 10,
                    fontFamily: "monospace",
                    fontSize: 30,
                    marginTop: "30px",
                    marginBottom: "10px",
                  }}
                >
                  Ordering
                </Header>
                <React.Fragment>
                  <Select
                    options={orderingOptions}
                    defaultValue={orderingOptions[0].text}
                    value={state.ordering}
                    onChange={onOrderingChange}
                  />
                </React.Fragment>
              </Grid.Column>
            </Grid.Row>
          </Grid>

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
