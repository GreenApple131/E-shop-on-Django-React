import React, { useEffect, useState} from "react";
import axios from "axios";
import {
  Divider,
  Header,
  Select,
} from "semantic-ui-react";
import { Slider, InputNumber } from "antd";
import "antd/dist/antd.css";
import CategoryFilter from "./CategoryFilter";
import {
  productFilterAndOrderURL,
  categories,
  orderingOptions,
} from "../constants";
import ItemsCards from "./ItemsCards";

import StickyBox from "react-sticky-box";

// import "./elements/filters.scss";
import "./elements/filter.css";
import "./common/index.css"


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

  return (
    <div>
      {/* categoryChoose={this.props.location.state.searchValue} */}
      <section className="section-b-space" style={{marginTop: '-50px'}}>
        <div className="collection-wrapper">
          <div className='container-fluid' style={{maxWidth: '90%'}}>
            <div className="row">
              <div className="col-sm-2 collection-filter">
                <StickyBox offsetTop={60} offsetBottom={20} style={{maxWidth: '200px'}}>
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
                {/*side-bar banner end here*/}
              </div>

              <div className="collection-content col">
                <div className="page-main-content ">
                  <div className="">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="top-banner-wrapper">
                          <a href="#">
                            <img
                              src={`${process.env.PUBLIC_URL}/assets/images/mega-menu/2.jpg`}
                              className="img-fluid"
                              alt=""
                            />
                          </a>
                          <div className="top-banner-content small-section">
                            <h4>fashion</h4>
                            <h5>
                              Lorem Ipsum is simply dummy text of the printing
                              and typesetting industry.
                            </h5>
                          </div>
                        </div>
                        <div className="collection-product-wrapper">
                          

                          {/*Products Listing Component*/}
                          {/* <ProductListing
                              colSize={this.state.layoutColumns}
                            /> */}
                          <ItemsCards data={state.data} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Divider />

      <CategoryFilter />
    </div>
  );
}

export default TestFilter;
// export default connect(null, mapDispatchToProps)(TestFilter);
