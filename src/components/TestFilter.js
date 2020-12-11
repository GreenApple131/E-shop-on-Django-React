import React, {
  Component,
  useEffect,
  useState,
  Fragment,
  Suspense,
  createRef,
} from "react";

import faker from "faker";
import _ from "lodash";
import { connect, Provider } from "react-redux";
// import { render } from "react-dom";
// import { combineReducers, createStore } from "redux";
// import _ from "lodash";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Breadcrumb,
  Container,
  Checkbox,
  Dimmer,
  Divider,
  Header,
  Icon,
  Image,
  Loader,
  Placeholder,
  Rail,
  Ref,
  Segment,
  Sticky,
} from "semantic-ui-react";
import CategoryFilter from "./CategoryFilter";
import {
  addToCartURL,
  productListURL,
  productListLimPriceURL,
  productListCategoryURL
} from "../constants";
import { authAxios } from "../utils";
import { fetchCart } from "../store/actions/cart";
import { ItemsCards } from "./ElementsCard";

// import "./elements/filters.scss";
import "./elements/filter.css";

function Found() {
  const [state, setState] = useState({
    data: [
      { name: "First Name", category: "cat", price: "5" },
      { name: "Second Name", category: "bird", price: "7" },
      { name: "Third Name", category: "dog", price: "12" },
    ],
    category: "all",
    priceStart: "",
    priceEnd: "",
  });
  function handleChange({ target: { name, value } }) {
    setState((prev) => ({ ...prev, [name]: value }));
  }
  let data = state.data;
  if (state.category && state.category !== "all") {
    data = data.filter((d) => d.category === state.category);
  }
  if (state.priceStart) {
    data = data.filter((d) => Number(d.price) >= Number(state.priceStart));
  }
  if (state.priceEnd) {
    data = data.filter((d) => Number(d.price) <= Number(state.priceEnd));
  }
  return (
    <div className="App">
      <div className="category d-flex">
        <h5>По категории</h5>
        <select
          id="category"
          name="category"
          value={state.category}
          onChange={handleChange}
        >
          <option>all</option>
          {state.data.map((d, i) => (
            <option key={i}>{d.category}</option>
          ))}
        </select>
      </div>
      <div className="price-filter d-flex">
        <div className="input-group ">
          <h5>По цене</h5>
          <input
            type="number"
            placeholder="с"
            value={state.priceStart}
            name="priceStart"
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="до"
            value={state.priceEnd}
            name="priceEnd"
            onChange={handleChange}
          />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button">
              Button
            </button>
          </div>
        </div>
      </div>
      <Divider />
      {data.map((d, i) => (
        <div key={i}>
          {d.name} {d.category} {d.price}
        </div>
      ))}
    </div>
  );
}

class TestFilter extends Component {
  state = {
    data: [],
    loading: false,
    activeCategory: '',
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const category = 'Hats'

    const res = await axios
      .get(productListCategoryURL(category))
      .then((res) => {
        this.setState({ data: res.data.results, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }

  render() {
    const { data, loading } = this.state;
    return (
      <React.Fragment>
        <Container>
          <Found />
          <Divider />
          <Divider />

          <Header>REST Data</Header>
          <ItemsCards data={data} />
        </Container>
      </React.Fragment>
    );
  }
}

export default TestFilter;
// export default connect(null, mapDispatchToProps)(TestFilter);
