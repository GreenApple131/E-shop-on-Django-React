import React, { Component } from "react";
import _ from "lodash";
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
  Input,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
} from "semantic-ui-react";
import { Navbar, Nav, NavDropdown, FormControl, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { productListURL, orderSummaryURL, mediaURL } from "../constants";
import { logout, logoutReload } from "../store/actions/auth";
import { fetchCart } from "../store/actions/cart";
import { SearchBar } from "./SearchResult";
import Categories from "./Categories";

// ResponsiveNavBar
import ResponsiveHeader from "dna-responsive-nav";
import "semantic-ui-css/semantic.min.css";
import "dna-responsive-nav/dist/dna-rn.css";
// ResponsiveNavBar
const Logo = mediaURL + "logo.png";


const NavBarMobile = ({
  children,
  leftItems,
  onPusherClick,
  onToggle,
  rightItems,
  visible
}) => (
  <Sidebar.Pushable>
    <Sidebar
      width='thin'
      as={Menu}
      animation="overlay"
      vertical
      visible={visible}
      size='huge'
      inverted
    >
        <Menu.Item href="/" name="Mixed"/>

        <Menu.Item>
          <Menu.Header>Men</Menu.Header>
            <Menu.Menu> 
              <Menu.Item href='/tester' name='Tester' />
              <Menu.Item href='/gifts' name='Gifts' />
              <Menu.Item href='/perfumes' name='Perfumes' />
            </Menu.Menu>
        </Menu.Item>
        </Sidebar>
    <Sidebar.Pusher
      dimmed={visible}
      onClick={onPusherClick}
      style={{ minHeight: "100vh" }}
    >
      <Menu fixed="top" inverted>
        <Menu.Item>
          <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
        </Menu.Item>
        <Menu.Item onClick={onToggle}>
          <Icon name="sidebar" />
        </Menu.Item>
        <Menu.Menu position="right" icon>
            <Menu.Item href='/tester' name='cart' >
            <Icon name='cart'/>
            </Menu.Item>
            <Menu.Item href='/gifts' name='user' >
            <Icon name='user'/>
            </Menu.Item>
        </Menu.Menu>
      </Menu>
      {children}
    </Sidebar.Pusher>
  </Sidebar.Pushable>
);

const NavBarDesktop = ({ leftItems, rightItems }) => (
  <div>
  <Menu fixed="top" borderless inverted>
    <Menu.Item>
      <Image size="mini" src="https://react.semantic-ui.com/logo.png" />
    </Menu.Item>
    <Menu.Item style={{width:380}}>
      <Input fluid icon='search' placeholder='Search for Products, Brands and More' />
    </Menu.Item>
    <Menu.Menu position="right">
      {_.map(rightItems, item => <Menu.Item {...item} />)}
    </Menu.Menu>
  </Menu>
  <Menu fixed="top" style={{ marginTop: "61" }} secondary>    
  <Menu.Menu>
    {_.map(leftItems, item => <Menu.Item {...item} />)}
  </Menu.Menu>
  </Menu>
  </div>
);

const NavBarChildren = ({ children }) => (
  <Container style={{ marginTop: "5em" }}>{children}</Container>
);

class NavBar extends Component {
  state = {
    visible: false
  };

  handlePusher = () => {
    const { visible } = this.state;

    if (visible) this.setState({ visible: false });
  };

  handleToggle = () => this.setState({ visible: !this.state.visible });

  render() {
    const { children, leftItems, rightItems } = this.props;
    const { visible } = this.state;

    return (
      <div>
        <Responsive {...Responsive.onlyMobile}>
          <NavBarMobile
            leftItems={leftItems}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            rightItems={rightItems}
            visible={visible}
          >
            <NavBarChildren>{children}</NavBarChildren>
          </NavBarMobile>
        </Responsive>
        <Responsive minWidth={Responsive.onlyTablet.minWidth}>
          <NavBarDesktop leftItems={leftItems} rightItems={rightItems} />
          <NavBarChildren>{children}</NavBarChildren>
        </Responsive>
      </div>
    );
  }
}

const leftItems = [
  { as: "a", content: "Mixed", key: "mixed" },
  { as: "a", content: "Men", key: "men" }
];
const rightItems = [
  { as: "a", content: "Signup", key: "signup" },
  { as: "a", content: "Log in", key: "login" }
];

const ResponsiveNavBar = ({children}) => (
  <NavBar leftItems={leftItems} rightItems={rightItems}>
    {children}
  </NavBar>
);

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

        <ResponsiveNavBar children={this.props.children}/>

        

        {/* {this.props.children} */}

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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CustomLayout)
);

// export default App;
