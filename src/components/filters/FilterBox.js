import React, { useEffect, useState } from "react";
import axios from "axios";
import { Divider, Header, Select } from "semantic-ui-react";
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
    <div className='filter-box'>
      <StickyBox offsetTop={60} offsetBottom={20}>
        <div>
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
            {categories.map((c, i) => (
              <div key={i}>
                <input
                  className="mr-2"
                  checked={filterstate.filters.index}
                  name={c}
                  value={c}
                  onChange={onCheckboxChange}
                  type="checkbox"
                />{" "}
                {c}
              </div>
            ))}
          </div>

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

          <Divider />
          {/* <ItemsCards data={data} /> */}
        </div>
      </StickyBox>
    </div>
  );
};
