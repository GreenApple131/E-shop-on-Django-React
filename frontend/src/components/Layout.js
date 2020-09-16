import React from "react";
import _ from "lodash";
import faker from "faker";
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
  Search,
  Segment,
  Visibility,
} from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
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
            <Menu inverted>
              <Container>
                <Grid>
                  <Grid.Column width={6}>
                    <Link to="/">
                      <Menu.Item pointing header>
                        Home
                      </Menu.Item>
                    </Link>
                  </Grid.Column>
                  <Grid.Column width={10}>
                    <Menu.Item>
                      <Search
                        size="mini"
                        input={{ fluid: true }}
                        loading={isLoading}
                        onResultSelect={this.handleResultSelect}
                        onSearchChange={_.debounce(
                          this.handleSearchChange,
                          500,
                          {
                            leading: true,
                          }
                        )}
                        placeholder="Search what do you want..."
                        results={results}
                        value={value}
                        style={{
                          marginTop: "-10px",
                          marginBottom: "-10px",
                          marginRight: "10px",
                          width: "200px",
                        }}
                      />
                    </Menu.Item>
                  </Grid.Column>
                </Grid>
                
                
                <Menu.Menu position="right">
                  {authenticated ? (
                    <React.Fragment>
                      <Link to="/profile">
                        <Menu.Item pointing>Profile</Menu.Item>
                      </Link>
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
                      <Menu.Item
                        header
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
                      <Menu.Item header>
                        <Link to="/login">Login</Link>
                      </Menu.Item>
                      <Menu.Item header>
                        <Link to="/signup">Signup</Link>
                      </Menu.Item>
                    </React.Fragment>
                  )}
                </Menu.Menu>
              </Container>
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
