import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Divider,
  Button,
  Card,
  Grid,
  Icon,
  Header,
  Select,
  Sidebar,
  Segment,
  Menu,
} from "semantic-ui-react";
import { Slider, InputNumber } from "antd";
import "antd/dist/antd.css";
import {
  productFilterAndOrderURL,
  categories,
  orderingOptions,
} from "../../constants.js";
import ElementsCard from "../ElementsCard";
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
    price_max: 1000,
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
        <div className="mobile-page">
          <Grid>
            <Grid.Row only="mobile">
              <Grid.Column>
                <div className="top-col-ordering">
                  <Select
                    options={orderingOptions}
                    defaultValue={orderingOptions[0].text}
                    value={state.ordering}
                    onChange={onOrderingChange}
                  />
                </div>
                <div className="top-col-filters">
                  <Button color="black" icon="sliders" />
                </div>
              </Grid.Column>
            </Grid.Row>
            <Divider style={{ marginTop: -15 }} />
            <Grid.Row style={{ marginTop: -30 }}>
              <Grid.Column>
                <div className="items-mobile">
                  <SidebarFilters />
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
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
          <div className="top-col">
            <div className="top-col-ordering-desktop">
              Ordering:{" "}
              <Select
                options={orderingOptions}
                defaultValue={orderingOptions[0].text}
                value={state.ordering}
                onChange={onOrderingChange}
              />
            </div>
            <div className="view-buttons-desktop">
              <ViewButtons />
            </div>
          </div>
          <Divider />
          <div>
            {cardView.activationGrid === 1 ? (
              <Card.Group className="items-desktop" fluid>
                {state.data.map((item, x) => (
                  <ElementsCard key={x} {...item}></ElementsCard>
                ))}
              </Card.Group>
            ) : cardView.activationList === 1 ? (
              <>
                <Header>Flat Cards</Header>
                
                {/* <SidebarFilters /> */}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

class SidebarFilters extends React.Component {
  state = {
    sidebarVisible: false,
  };

  toggleSidebar = () => {
    this.setState({ sidebarVisible: !this.state.sidebarVisible });
  };

  render() {
    const { sidebarVisible } = this.state;
    return (
      <div>
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="push"
            width="thin"
            visible={sidebarVisible}
            icon="labeled"
            vertical
            inverted
            className="sidebar-menu"
            style={{ width: "100%" }}
          >
            <Menu.Header name="brand" className="item">
              Brand
            </Menu.Header>
            <Menu.Item link onClick={this.toggleSidebar}>
              <Icon name="book" />
              Menu 1
            </Menu.Item>
            <Menu.Item link onClick={this.toggleSidebar}>
              <Icon name="graduation" />
              Menu 2
            </Menu.Item>
            <Menu.Item link onClick={this.toggleSidebar}>
              <Icon name="setting" />
              Menu 3
            </Menu.Item>
            <Menu.Item link onClick={this.toggleSidebar}>
              <Icon name="user" />
              Menu 4
            </Menu.Item>
            <Menu.Item link onClick={this.toggleSidebar}>
              <Icon name="sign out" />
              Logout
            </Menu.Item>
          </Sidebar>
          <Menu inverted borderless fixed="top" className="header-menu">
            <Menu.Item
              position="left"
              link
              icon
              active={sidebarVisible}
              onClick={this.toggleSidebar}
            >
              <Icon
                name="bars"
                aria-label="menu"
                className="menu-icon"
                size="large"
              />
            </Menu.Item>
          </Menu>
          <Sidebar.Pusher dimmed={sidebarVisible}>
            <div>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
              <Segment basic>BlahBlah</Segment>
            </div>
            <Menu inverted borderless fixed="bottom" className="bottom-menu">
              <Menu.Item>Bottom Fixed Menu</Menu.Item>
            </Menu>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default TestFilter;
// export default connect(null, mapDispatchToProps)(TestFilter);
