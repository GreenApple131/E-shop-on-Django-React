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
  Image,
  Icon,
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

const source = _.times(5, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.internet.avatar(),
  price: faker.finance.amount(0, 100, 2, "$"),
}));

const initialState = { isLoading: false, results: [], value: "" };

class CustomLayout extends React.Component {
  state = initialState;

  handleResultSelect = (e, { result }) =>
    this.setState({ value: result.title });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = (result) => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch),
      });
    }, 300);
  };

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
              <Grid columns={5} container columns="5">
                <Grid.Column width={2}>
                  <Menu.Item header>
                    <Link to="/">Home</Link>
                  </Menu.Item>
                </Grid.Column>
                <Grid.Column width={8}>
                  <Menu.Item header>{/* <SearchFilter /> */}</Menu.Item>
                </Grid.Column>
                {/* <Grid.Column width={8}>
                  <Search
                    size="mini"
                    input={{ fluid: true }}
                    loading={isLoading}
                    onResultSelect={this.handleResultSelect}
                    onSearchChange={_.debounce(this.handleSearchChange, 500, {
                      leading: true,
                    })}
                    placeholder="Search what do you want..."
                    results={results}
                    value={value}
                    style={{
                      marginTop: "7px",
                      // marginBottom: "-10px",
                      // marginRight: "10px",
                      width: "auto",
                    }}
                  />
                </Grid.Column> */}
                {authenticated ? (
                  <React.Fragment>
                    <Grid.Column width={2}>
                      <Link to="/profile">
                        <Menu.Item pointing>Profile</Menu.Item>
                      </Link>
                    </Grid.Column>
                    <Grid.Column width={2}>
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
                    <Grid.Column width={2}>
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

URL = "https://10degrees.uk/wp-json/wp/v2/posts"; // URL variable stores JSON url || API taken from 10 Degrees WordPress Agency

export class SearchFilter extends React.Component {
	state = {
		post: [],
		allPosts: []
	};

	componentDidMount() {
		axios
			.get(URL, {
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json"
				}
			})
			.then(({ data }) => {
				this.setState({
					post: data,
					allPosts: data // array data from JSON stored in these
				});
			})
			.catch(err => {});
	}

	_onKeyUp = e => {
		// filter post list by title using onKeyUp function
		const post = this.state.allPosts.filter(item =>
			item.title.rendered.toLowerCase().includes(e.target.value.toLowerCase())
		);
		this.setState({ post });
	};

	render() {
		return (
			<div className="container">
				<div className="search-outer">
					<form
						role="search"
						method="get"
						id="searchform"
						className="searchform"
						action=""
					>
						{/* input field activates onKeyUp function on state change */}
						<input
							type="search"
							onChange={this._onKeyUp}
							name="s"
							id="s"
							placeholder="Search"
						/>
						<button type="submit" id="searchsubmit">
							<i className="fa fa-search" aria-hidden="true" />
						</button>
					</form>
				</div>
				<ul className="data-list">
					{/* post items mapped in a list linked to onKeyUp function */}
					{this.state.post.map((item, index) => (
						<li className={"block-" + index}>
							<a className="title" href={item.link}>
								<h3>{item.title.rendered}</h3>
							</a>
							<a className="link" href={item.link}>
							 
							</a>
						</li>
					))}
				</ul>
			</div>
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
