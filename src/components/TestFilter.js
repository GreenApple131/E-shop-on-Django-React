import React, { useEffect, useState } from "react";
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
  Container,
  Divider,
  Header,
  Loader,
  Rail,
  Ref,
  Segment,
  Sticky,
} from "semantic-ui-react";
import {
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  InputLabel,
  Select,
  Slider,
  TextField,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
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

function TestFilter() {
  // const history = useHistory();

  const [error, setError] = useState("");

  // Request looks like:
  // /api/?title=hat&price_min=10&price_max=100&category=Hats&other_marks=new&ordering=price

  const [state, setState] = useState({
    data: [],
    category: undefined,
    category: undefined,
    price_min: undefined,
    price_max: undefined,
    other_marks: undefined,
    ordering: "price",
  });

  useEffect(() => {
    axios
      .get(
        productFilterAndOrderURL(
          state.category,
          state.price_min,
          state.price_max,
          state.other_marks,
          state.ordering
        )
      )
      // .get(productListCategoryURL(category))
      .then((res) => {
        console.log("TestFilter", res.data.results);
        const itemsFixedPrice = res.data.results.map((pr) => {
          pr.price = pr.price.toString();
          return pr;
        });
        setState({
          ...state,
          data: itemsFixedPrice,
          category: res.data.results.category,
        });
      })
      .catch((err) => {
        setError(err);
      });
  }, []); // when category changes, starts useEffect

  function handleChange({ target: { name, value } }) {
    setState((prev) => ({ ...prev, [name]: value }));
  }

  let data = state.data;
  let category = state.category;

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
            {data.map((c) => (<></>))}
          <Divider />
          <ItemsCards data={data} />
        </React.Fragment>

        <Divider />
      </Container>

      <CategoryFilter />
    </React.Fragment>
  );
}

export default TestFilter;
// export default connect(null, mapDispatchToProps)(TestFilter);
