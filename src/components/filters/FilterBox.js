import React, { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox, Divider, Header, Input, Select } from "semantic-ui-react";
import { Slider, InputNumber } from "antd";
import "antd/dist/antd.css";
import {
  productFilterAndOrderURL,
  categories,
  orderingOptions,
} from "../../constants.js";
import ItemsCards from "../ItemsCards";

import StickyBox from "react-sticky-box";

// import "./elements/filters.scss";
import "../elements/filter.css";
import "../elements/filterbox.css";

export const FilterBox = (props) => {
  const {
    categories,
    filterstate,
    state,
    onCheckboxChange,
    onPriceChange,
    onPriceChangeMin,
    onPriceChangeMax,
    onOrderingChange,
  } = props;
  return (
    <div className="filter-box">
      <StickyBox offsetTop={60} offsetBottom={20}>
        <div>
          <Header
            style={{
              fontFamily: "monospace",
              fontSize: 24,
              marginTop: "30px",
              marginBottom: "10px",
              marginLeft: -3,
            }}
          >
            Categories
          </Header>
          <div>
            {categories.map((c, i) => (
              <div key={i} className="custom-control custom-checkbox">
                <input
                  className="custom-control-input"
                  checked={filterstate.filters.index}
                  name={c}
                  value={c}
                  id={c}
                  onChange={onCheckboxChange}
                  type="checkbox"
                />
                <label className="custom-control-label" htmlFor={c}>{c}</label>
                <br />
              </div>
            ))}
          </div>

          <Header
            style={{
              fontFamily: "monospace",
              fontSize: 24,
              marginTop: "15px",
              marginBottom: "10px",
              marginLeft: -1,
            }}
          >
            Price
          </Header>
          <React.Fragment>
            <Slider
              style={{ maxWidth: "190px" }}
              min={0}
              max={1000}
              onChange={onPriceChange}
              range={true}
              defaultValue={[state.price_min, state.price_max]}
              value={[state.price_min, state.price_max]}
            />
            <div className="range-input-number-main">
              <InputNumber
                size="small"
                className="min-input-main"
                min={0}
                max={1000}
                value={state.price_min}
                onChange={onPriceChangeMin}
              />
              <span className="range-span"> - </span>
              <InputNumber
                size="small"
                width={40}
                className="min-input-main"
                min={0}
                max={1000}
                value={state.price_max}
                onChange={onPriceChangeMax}
                onStep="false"
              />
            </div>
          </React.Fragment>
          {/* <Header
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
          </React.Fragment> */}

          <Divider />
          {/* <ItemsCards data={data} /> */}
        </div>
      </StickyBox>
    </div>
  );
};
