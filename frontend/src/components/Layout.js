import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import { createMedia } from "@artsy/fresnel";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  List,
  Menu,
  Segment,
  Visibility,
} from "semantic-ui-react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { productListURL } from "../constants";
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
  constructor(props) {
    super(props);
    this.state = { value: "", data: [] };
  }

  async componentDidMount() {
    this.setState({ loading: true });
    this.props.fetchCart();

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

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { authenticated, cart, loading } = this.props;
    const { data } = this.state;

    return (
      <React.Fragment>
        <Media greaterThan="mobile">
          <Visibility
            once={false}
            onBottomPassed={this.showFixedMenu}
            onBottomPassedReverse={this.hideFixedMenu}
          >
            <Navbar
              fixed="top"
              collapseOnSelect
              expand="lg"
              variant="dark"
              style={{ backgroundColor: "#1b1c1d" }}
            >
              <Navbar.Brand href="/">Stiles&Lydia</Navbar.Brand>
              <Nav>
                <NavDropdown
                  title="Categories"
                  id="collasible-nav-dropdown"
                  loading={loading}
                >
                  <NavDropdown.Item>
                    Jackets
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Nav className="justify-content-center responsive-navbar-nav">
                <Nav.Item>
                  <SearchBar />
                </Nav.Item>
              </Nav>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav>
                  {authenticated ? (
                    <React.Fragment>
                      <Grid.Column width="2">
                        <Link to="/profile">
                          <Menu.Item>Profile</Menu.Item>
                        </Link>
                      </Grid.Column>
                      <Grid.Column width="1">
                        <Dropdown
                          icon="cart"
                          loading={loading}
                          text={`${
                            cart !== null ? cart.order_items.length : 0
                          }`}
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
                              <Dropdown.Item>
                                No items in your cart
                              </Dropdown.Item>
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
                      <Grid.Column width="2">
                        <Menu.Item
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
                      <Nav.Link href="/login">Login</Nav.Link>

                      <Nav.Link href="/signup">Signup</Nav.Link>
                    </React.Fragment>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Navbar>
            {/* <Menu
              fixed="top"
              inverted
              pointing
              borderless
              style={{ height: "45px" }}
            >
              <Grid container columns="6">
                <Grid.Column width="2">
                  <Link to="/">
                    <Menu.Item header>Home</Menu.Item>
                  </Link>
                </Grid.Column>
                <Grid.Column width="2">
                  <Dropdown
                    // icon="cart"
                    loading={loading}
                    text="Categories"
                    className="link item"
                  >
                    <Dropdown.Menu>
                      {data.map(
                        (item) =>
                          item.category_type === "Men" && (
                            <Dropdown.Item
                              key={item.id}
                              onClick={() =>
                                this.props.history.push(
                                  {
                                    pathname: `/${item.category}`.toLowerCase(),
                                    state: { categoryChoose: item.category.toLowerCase() },
                                    // access to state - this.props.location.state.*******
                                  }
                                )
                              }
                            >
                              {item.category}
                            </Dropdown.Item>
                          )
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Grid.Column>
                <SearchBar />
                {authenticated ? (
                  <React.Fragment>
                    <Grid.Column width="2">
                      <Link to="/profile">
                        <Menu.Item>Profile</Menu.Item>
                      </Link>
                    </Grid.Column>
                    <Grid.Column width="1">
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
                    <Grid.Column width="2">
                      <Menu.Item
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
                    <Grid.Column width="2">
                      <Menu.Item>
                        <Link to="/login">Login</Link>
                      </Menu.Item>
                    </Grid.Column>

                    <Grid.Column width="2">
                      <Menu.Item>
                        <Link to="/signup">Signup</Link>
                      </Menu.Item>
                    </Grid.Column>
                  </React.Fragment>
                )}
              </Grid>
            </Menu> */}
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
