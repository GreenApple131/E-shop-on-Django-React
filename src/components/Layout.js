import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { authAxios } from "../utils";
import {
  Button,
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
} from "semantic-ui-react";
import { productListURL, orderSummaryURL, mediaURL } from "../constants";
import { logout, logoutReload } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";
import { SearchBar } from "./SearchResult";
import Categories from "./Categories";

// ResponsiveNavBar
import "semantic-ui-css/semantic.min.css";
import "./elements/navbar.css";
// ResponsiveNavBar
const Logo = mediaURL + "logo.png";

class CustomLayout extends Component {
  state = {
    value: "",
    data: [],
    dropdownMenuStyle: {
      display: "none",
    },
  };

  handleToggleDropdownMenu = () => {
    let newState = Object.assign({}, this.state);
    if (newState.dropdownMenuStyle.display === "none") {
      newState.dropdownMenuStyle = { display: "flex" };
    } else {
      newState.dropdownMenuStyle = { display: "none" };
    }

    this.setState(newState);
  };

  componentWillMount() {
    this.props.fetchCart(); // update the cart count
  }

  async componentDidMount() {
    this.setState({ loading: true });
    this.handleFetchOrder();

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

  handleFetchOrder = () => {
    this.setState({ loading: true });
    authAxios
      .get(orderSummaryURL)
      .then((res) => {
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          this.setState({
            error: "You currently do not have an order",
            loading: false,
          });
        } else {
          this.setState({ error: err, loading: false });
        }
      });
  };

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { authenticated, cart, loading } = this.props;
    const { data } = this.state;

    return (
      <React.Fragment>
        <div className="App">
          <Grid padded className="tablet computer only">
            <Menu borderless fluid fixed="top" size="huge" inverted>
              <Container>
                <Menu.Item onClick={() => this.props.history.push("/")}>
                  <Image
                    size="mini"
                    src={Logo}
                    style={{
                      marginRight: "1.5em",
                      marginTop: "-15px",
                      marginBottom: "-10px",
                    }}
                  />
                  Stiles&Lydia
                </Menu.Item>

                <Dropdown item simple text="Categories" className="link item">
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => this.props.history.push("/allitems")}
                    >
                      All Items
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        this.props.history.push("/category/jackets")
                      }
                    >
                      Jackets
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.props.history.push("/category/coats")}
                    >
                      Coats
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        this.props.history.push("/category/outwear")
                      }
                    >
                      Outwear
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.props.history.push("/category/hats")}
                    >
                      Hats
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        this.props.history.push("/category/shirts")
                      }
                    >
                      Shirts
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        this.props.history.push("/category/t-shirts")
                      }
                    >
                      T-shirts
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.props.history.push("/category/sport")}
                    >
                      Sports
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.props.history.push("/category/shoes")}
                    >
                      Shoes
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <SearchBar />
                <Menu.Menu position="right">
                  {authenticated ? (
                    <React.Fragment>
                      <Menu.Item
                        onClick={() => this.props.history.push("/profile")}
                      >
                        Profile
                      </Menu.Item>
                      <Dropdown
                        icon="cart"
                        loading={loading}
                        text={`${cart !== null ? cart.order_items.length : 0}`}
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
                          {cart && cart.order_items.length <= 0 ? (
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
                      <Menu.Item
                        onClick={() => {
                          this.props.logout();
                          this.props.logoutReload();
                        }}
                      >
                        Logout
                      </Menu.Item>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Menu.Item
                        onClick={() => this.props.history.push("/login")}
                      >
                        Login
                      </Menu.Item>

                      <Menu.Item
                        onClick={() => this.props.history.push("/signup")}
                      >
                        Signup
                      </Menu.Item>
                    </React.Fragment>
                  )}
                </Menu.Menu>
              </Container>
            </Menu>
          </Grid>
          <Grid padded className="mobile only">
            <Menu borderless fluid fixed="top" size="huge" inverted>
              <Menu.Item onClick={() => this.props.history.push("/")}>
                Stiles&Lydia
              </Menu.Item>
              <Menu.Menu position="right">
                <Menu.Item>
                  <Button
                    icon
                    basic
                    toggle
                    onClick={this.handleToggleDropdownMenu}
                  >
                    <Icon name="content" />
                  </Button>
                </Menu.Item>
              </Menu.Menu>
              <Menu
                vertical
                borderless
                fluid
                style={this.state.dropdownMenuStyle}
              >
                <Dropdown text="Categories" className="link item">
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() =>
                        this.props.history.push("/category/jackets")
                      }
                    >
                      Jackets
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.props.history.push("/category/coats")}
                    >
                      Coats
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        this.props.history.push("/category/outwear")
                      }
                    >
                      Outwear
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.props.history.push("/category/hats")}
                    >
                      Hats
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        this.props.history.push("/category/shirts")
                      }
                    >
                      Shirts
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        this.props.history.push("/category/t-shirts")
                      }
                    >
                      T-shirts
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.props.history.push("/category/sport")}
                    >
                      Sports
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => this.props.history.push("/category/shoes")}
                    >
                      Shoes
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <SearchBar />
                {authenticated ? (
                  <React.Fragment>
                    <Menu.Item
                      onClick={() => this.props.history.push("/profile")}
                    >
                      Profile
                    </Menu.Item>
                    <Dropdown
                      icon="cart"
                      loading={loading}
                      text={`${cart !== null ? cart.order_items.length : 0}`}
                      className="link item"
                    >
                      <Dropdown.Menu>
                        {cart &&
                          cart.order_items.map((order_item) => {
                            return (
                              <Dropdown.Item key={order_item.id}>
                                {order_item.quantity} x {order_item.item.title}
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
                    <Menu.Item
                      onClick={() => {
                        this.props.logout();
                        this.props.logoutReload();
                      }}
                    >
                      Logout
                    </Menu.Item>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Menu.Item
                      onClick={() => this.props.history.push("/login")}
                    >
                      Login
                    </Menu.Item>

                    <Menu.Item
                      onClick={() => this.props.history.push("/signup")}
                    >
                      Signup
                    </Menu.Item>
                  </React.Fragment>
                )}
              </Menu>
            </Menu>
          </Grid>
          {this.props.children}
        </div>

        <Segment inverted vertical style={{ padding: "4em 0em" }}>
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
