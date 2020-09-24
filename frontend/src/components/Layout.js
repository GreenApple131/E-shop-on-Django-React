import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import faker from "faker";
import { createMedia } from "@artsy/fresnel";
import {
  Button,
  Card,
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Item,
  Label,
  List,
  Menu,
  Search,
  Segment,
  Visibility,
} from "semantic-ui-react";
import { productListURL } from "../constants";
import { logout, logoutReload } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";

const { Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

const source = _.range(0, 1).reduce((memo) => {
  const name = "title";

  // eslint-disable-next-line no-param-reassign
  memo[name] = {
    name,
    results: _.times(1, () => ({
      title: "Jacket",
      description: "description",
      // image: faker.internet.avatar(),
      price: "$30",
    })),
  };

  return memo;
}, {});

const initialState = { isLoading: false, results: [], value: "" };

class CustomLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handlePressEnter = this.handlePressEnter.bind(this);
  }

  state = initialState;

  async componentDidMount() {
    this.setState({ loading: true });

    // this.props.fetchCart(); // update the cart count

    const res = await axios
      .get(productListURL)
      .then((res) => {
        console.log(res.data);
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }

  // Search bar
  handlePressEnter(e) {
    this.setState({ value: e.target.value });
    if (e.keyCode == 13) {
      this.props.history.push(`/search/result/${e.target.value}`);
    }
  }

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title });
    this.props.history.push(`/products/${result.title}`);
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = (result) => re.test(result.title);

      const filteredResults = _.reduce(
        source,
        (memo, f_data, name) => {
          const results = _.filter(f_data.results, isMatch);
          if (results.length) memo[name] = { name, results }; // eslint-disable-line no-param-reassign

          return memo;
        },
        {}
      );

      this.setState({
        isLoading: false,
        results: filteredResults,
      });
    }, 300);
  };
  // end Search bar

  componentDidMount() {
    this.props.fetchCart();
  }

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { isLoading, value, results } = this.state;
    const { authenticated, cart, loading } = this.props;

    return (
      <React.Fragment>
        <Media greaterThan="mobile">
          <Visibility
            once={false}
            onBottomPassed={this.showFixedMenu}
            onBottomPassedReverse={this.hideFixedMenu}
          >
            <Menu fixed="top" inverted borderless>
              <Grid container columns="5">
                <Grid.Column width="2">
                  <Link to="/">
                    <Menu.Item header pointing>
                      Home
                    </Menu.Item>
                  </Link>
                </Grid.Column>
                <Grid.Column width="10">
                  <Search
                    size="mini"
                    category
                    input={{ fluid: "true" }}
                    loading={isLoading}
                    onKeyDown={this.handlePressEnter}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, {
                      leading: true,
                    })}
                    results={results}
                    value={value}
                    placeholder="Search what do you want..."
                    style={{
                      name: "search",
                      circular: true,
                      link: true,
                      marginTop: "7px",
                      // marginBottom: "-10px",
                      // marginRight: "10px",
                      width: "auto",
                    }}
                  />
                </Grid.Column>
                {authenticated ? (
                  <React.Fragment>
                    <Grid.Column width="2">
                      <Link to="/profile">
                        <Menu.Item pointing>Profile</Menu.Item>
                      </Link>
                    </Grid.Column>
                    <Grid.Column width="1">
                      <Dropdown
                        icon="cart"
                        loading={loading}
                        text={`${cart !== null ? cart.order_items.length : 0}`}
                        pointing
                        className="link item"
                      >
                        <Dropdown.Menu>
                          {cart &&
                            cart.order_items.map((order_item) => {
                              return (
                                <Dropdown.Item key={order_item.id}>
                                  {order_item.quantity} x{" "}
                                  {order_item.item.title}
                                </Dropdown.Item>
                              );
                            })}
                          {cart && cart.order_items.length < 1 ? (
                            <Dropdown.Item>No items in your cart</Dropdown.Item>
                          ) : null}
                          <Dropdown.Divider />
                          <Dropdown.Item
                            icon="arrow right"
                            text="Chechout"
                            onClick={() =>
                              this.props.history.push("/order-summary")
                            }
                          />
                        </Dropdown.Menu>
                      </Dropdown>
                    </Grid.Column>
                    <Grid.Column width="1">
                      <Menu.Item
                        header
                        onClick={() => {
                          this.props.logout();
                          this.props.logoutReload();
                        }}
                      >
                        Logout
                      </Menu.Item>
                    </Grid.Column>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Grid.Column width={2}>
                      <Menu.Item header>
                        <Link to="/login">Login</Link>
                      </Menu.Item>
                    </Grid.Column>

                    <Grid.Column width={2}>
                      <Menu.Item header>
                        <Link to="/signup">Signup</Link>
                      </Menu.Item>
                    </Grid.Column>
                  </React.Fragment>
                )}
              </Grid>
            </Menu>
          </Visibility>

          {this.props.children}
        </Media>

        <Segment inverted vertical style={{ padding: "5em 0em" }}>
          <Container textAlign="center">
            <Grid divided inverted stackable>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="About" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Services" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={3}>
                <Header inverted as="h4" content="Partners" />
                <List link inverted>
                  <List.Item as="a">Link One</List.Item>
                  <List.Item as="a">Link Two</List.Item>
                  <List.Item as="a">Link Three</List.Item>
                  <List.Item as="a">Link Four</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <Header as="h4" inverted>
                  Footer Header
                </Header>
                <p>
                  Extra space for a call to action inside the footer that could
                  help re-engage users.
                </p>
              </Grid.Column>
            </Grid>

            <Divider inverted section />
            <Image centered size="mini" src="/logo.png" />
            <List horizontal inverted divided link size="small">
              <List.Item as="a" href="#">
                Site Map
              </List.Item>
              <List.Item as="a" href="#">
                Contact Us
              </List.Item>
              <List.Item as="a" href="#">
                Terms and Conditions
              </List.Item>
              <List.Item as="a" href="#">
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    logoutReload: () => dispatch(logoutReload()),
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CustomLayout)
);
