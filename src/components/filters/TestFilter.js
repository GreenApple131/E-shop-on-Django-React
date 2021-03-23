import React, { useEffect, useState } from "react";
import axios from "axios";
import { Divider, Button, Dropdown, Grid, Header, Select } from "semantic-ui-react";
import { Slider, InputNumber } from "antd";
import "antd/dist/antd.css";
import {
  productFilterAndOrderURL,
  categories,
  orderingOptions,
} from "../../constants.js";
import ItemsCards from "../ItemsCards";
import { FilterBox } from "./FilterBox.js";

import "../common/index.css";

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
  const [cardView, setCardView] = useState({
    cards: "grid",
    activationGrid: 1,
    activationList: 0,
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
  }, [
    filterstate.multipleCategories,
    state.price_min,
    state.price_max,
    state.ordering,
  ]);

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

  const onOrderingChange = (e, { value }) => {
    setState((prevState) => ({
      ...prevState,
      ordering: value,
    }));
  };

  const ViewButtons = () => (
    <Button.Group>
      <Button
        size="large"
        icon="grid layout"
        onClick={() =>
          setCardView({
            cards: "grid",
            activationGrid: 1,
            activationList: 0,
          })
        }
        active={cardView.activationGrid}
      />
      <Button
        size="large"
        icon="list layout"
        onClick={() =>
          setCardView({
            cards: "list",
            activationGrid: 0,
            activationList: 1,
          })
        }
        active={cardView.activationList}
      />
    </Button.Group>
  );
  return (
    <div style={{ marginLeft: 10 }}>
      {/* categoryChoose={this.props.location.state.searchValue} */}

      <div className="filter-grid">
        <Grid style={{ marginTop: 30, marginLeft: 30 }}>
          <Grid.Row only="mobile">
            <Grid.Column>
              <div className="top-col-ordering">
                <Button icon="sliders" label='Ordering'/>
              </div>
              <div className="top-col-filters">
                <Button icon="sliders"/>
              </div>

              {/* <div className="top-col-buttons"> */}
                {/* <ViewButtons /> */}
              {/* </div> */}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className="filter-left">
          <FilterBox
            categories={categories}
            filterstate={filterstate}
            state={state}
            onCheckboxChange={onCheckboxChange}
            onPriceChange={onPriceChange}
            onPriceChangeMin={onPriceChangeMin}
            onPriceChangeMax={onPriceChangeMax}
            onOrderingChange={onOrderingChange}
          />
        </div>

        <div className="filter-right">
          <div className="view-buttons-desktop">
            <ViewButtons />
          </div>
          <Divider />
          <div>
            {cardView.activationGrid === 1 ? (
              <ItemsCards data={state.data} />
            ) : cardView.activationList === 1 ? (
              <> ItemsList </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestFilter;
// export default connect(null, mapDispatchToProps)(TestFilter);
