import React, { useEffect, useState,  } from "react";
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
import CategoryFilter from "../CategoryFilter";
import {
  addToCartURL,
  productListURL,
  productFilterAndOrderURL,
  productListCategoryURL
} from "../../constants";
import { authAxios } from "../../utils";
import { fetchCart } from "../../store/actions/cart";
import { ItemsCards } from "../ElementsCard";

// import "./elements/filters.scss";
import "./elements/filter.css";


  function TestFilter() {
    // const history = useHistory();
  
    const category = undefined;
    const price_min = 1;
    const price_max = 999;
    const other_marks = undefined;
    const ordering = '-price';

    const [getData, setData] = useState([]);
    const [error, setError] = useState("");
    
    const [state, setState] = useState({
      data: [],
      category: "all",
      priceStart: "",
      priceEnd: "",
    });

    

    useEffect(() => {
      axios
        .get(productFilterAndOrderURL(category, price_min, price_max, other_marks, ordering))
        // .get(productListCategoryURL(category))
        .then((res) => {
          console.log('TestFilter', res.data.results)
          const itemsFixedPrice = res.data.results.map((pr) => {
            pr.price = pr.price.toString()
            return( pr )
          })
          console.log('itemsFixedPrice', itemsFixedPrice)
          setData(res.data.results);
          setState({...state, data: itemsFixedPrice, category: res.data.results.category} )
        })
        .catch((err) => {
          setError(err);
        });
    }, []); // when category changes, starts useEffect
  
    
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
      <React.Fragment>
        {/* categoryChoose={this.props.location.state.searchValue} */}
        <Container style={{ marginTop: "10px" }}>
        <div className="App">
      <div className="category d-flex">
        <h5>По категории</h5>
        {/* <select
          id="category"
          name="category"
          value={state.category}
          onChange={handleChange}
        >
          <option>all</option>
          {state.data.map((d, i) => (
            <option key={i}>{d.category}</option>
          ))}
        </select> */}
        <FormControl component="fieldset">
      <FormLabel component="legend">Filter by Color</FormLabel>
      <FormGroup>
        {state.data.map((d, i) => {
          return (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  // checked={d.category}
                  // value={d.category}
                  color="primary"
                  onChange={handleChange}
                  name={d.category}
                />
              }
              label={d.category}
            />
          );
        })}
      </FormGroup>
    </FormControl>
        {/* {state.data.map((d, i) => (
            <Checkbox key={i}>{d.category}</Checkbox>
          ))} */}
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
      <ItemsCards data={data} />
    </div>
          <Header
            style={{
              margin: 10,
              fontFamily: "monospace",
              fontSize: 32,
              marginTop: "30px",
              marginBottom: "10px",
            }}
          >
            {category}
          </Header>
          <Divider />
        </Container>
        {/* <Container>
          <ItemsCards data={getData} />
        </Container> */}
  
        <CategoryFilter />
      </React.Fragment>
    );
  }

export default TestFilter;
// export default connect(null, mapDispatchToProps)(TestFilter);
