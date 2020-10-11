import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, NavLink, withRouter } from "react-router-dom";
import axios from "axios";
import { authAxios } from "../utils";
import { createMedia } from "@artsy/fresnel";
import {
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
  Sidebar,
  Visibility,
} from "semantic-ui-react";
import { Navbar, Nav, NavDropdown, FormControl, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { productListURL, orderSummaryURL } from "../constants";
import { logout, logoutReload } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";
import { SearchBar } from "./SearchResult";
import Categories from "./Categories";

const { Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

class CustomLayout extends Component {
  state = { value: "", data: [] };

  async componentDidMount() {
    this.setState({ loading: true });
    this.props.fetchCart();
    this.handleFetchOrder();

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

  handleSidebarHide = () => this.setState({ sidebarOpened: false });
  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { authenticated, cart, loading } = this.props;
    const { data, fixed, sidebarOpened } = this.state;

    return (
      <React.Fragment>
        {}
        <Media as={Sidebar.Pushable} at="mobile">
          <Sidebar.Pushable>
            <Sidebar
              as={Menu}
              animation="overlay"
              inverted
              onHide={this.handleSidebarHide}
              vertical
              visible={sidebarOpened}
            >
              <Menu.Item as="a" active>
                Home
              </Menu.Item>
              <Menu.Item as="a">Work</Menu.Item>
              <Menu.Item as="a">Company</Menu.Item>
              <Menu.Item as="a">Careers</Menu.Item>
              <Menu.Item as="a">Log in</Menu.Item>
              <Menu.Item as="a">Sign Up</Menu.Item>
            </Sidebar>

            <Sidebar.Pusher dimmed={sidebarOpened}>
              <Segment
                inverted
                textAlign="center"
                style={{ minHeight: 45, padding: "0em 0em" }}
                vertical
              >
                <Container>
                  <Menu inverted pointing secondary size="large">
                    <Menu.Item onClick={this.handleToggle}>
                      <Icon name="sidebar" />
                    </Menu.Item>
                    <Menu.Item position="right">
                      <Button as="a" inverted>
                        Log in
                      </Button>
                      <Button as="a" inverted style={{ marginLeft: "0.5em" }}>
                        Sign Up
                      </Button>
                    </Menu.Item>
                  </Menu>
                </Container>
              </Segment>

              {this.props.children}
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Media>

        <Media greaterThan="mobile">
          <Visibility
            once={false}
            onBottomPassed={this.showFixedMenu}
            onBottomPassedReverse={this.hideFixedMenu}
          >
            <Menu fixed="top" inverted borderless style={{ height: "45px" }}>
              <Container>
                <Menu.Item onClick={() => this.props.history.push("/")}>
                  Home
                </Menu.Item>

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
              </Container>
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
                  <Menu.Item onClick={() => this.props.history.push("/login")}>
                    Login
                  </Menu.Item>

                  <Menu.Item onClick={() => this.props.history.push("/signup")}>
                    Signup
                  </Menu.Item>
                </React.Fragment>
              )}
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

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });
  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Media as={Sidebar.Pushable} at="mobile">
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="overlay"
            inverted
            onHide={this.handleSidebarHide}
            vertical
            visible={sidebarOpened}
          >
            <Menu.Item as="a" active>
              Home
            </Menu.Item>
            <Menu.Item as="a">Work</Menu.Item>
            <Menu.Item as="a">Company</Menu.Item>
            <Menu.Item as="a">Careers</Menu.Item>
            <Menu.Item as="a">Log in</Menu.Item>
            <Menu.Item as="a">Sign Up</Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened}>
            <Segment
              inverted
              textAlign="center"
              style={{ minHeight: 45, padding: "0em 0em" }}
              vertical
            >
              <Container>
                <Menu inverted pointing secondary size="large">
                  <Menu.Item onClick={this.handleToggle}>
                    <Icon name="sidebar" />
                  </Menu.Item>
                  <Menu.Item position="right">
                    <Button as="a" inverted>
                      Log in
                    </Button>
                    <Button as="a" inverted style={{ marginLeft: "0.5em" }}>
                      Sign Up
                    </Button>
                  </Menu.Item>
                </Menu>
              </Container>
            </Segment>

            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Media>
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

// export default withRouter(
//   connect(mapStateToProps, mapDispatchToProps)(CustomLayout)
// );

export default MobileContainer;
