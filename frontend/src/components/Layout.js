import React from "react"
import { createMedia } from '@artsy/fresnel'
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
  Visibility
} from "semantic-ui-react"
import { Link, withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { logout, logoutReload } from "../store/actions/auth"
import { fetchCart } from '../store/actions/cart'


const { Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

class CustomLayout extends React.Component {

  componentDidMount() {
    this.props.fetchCart();
  }

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  render() {
    const { authenticated, cart, loading } = this.props;
    return (
      <div>
        <Media greaterThan='mobile'>
          <Visibility
            once={false}
            onBottomPassed={this.showFixedMenu}
            onBottomPassedReverse={this.hideFixedMenu}
          >

              <Menu inverted>
                <Container>
                  <Link to="/">
                    <Menu.Item header>Home</Menu.Item>
                  </Link>
                  <Link to="/products">
                    <Menu.Item header>Products</Menu.Item>
                  </Link>
                  <Menu.Menu position='right'>
                  {authenticated ? (
                    
                    <React.Fragment>
                    <Dropdown
                      icon='cart'
                      loading={loading}
                      text={`${cart !== null ? cart.order_items.length : 0}`}
                      pointing 
                      className='link item'
                    >
                      <Dropdown.Menu>
                        {cart && cart.order_items.map(order_item => {
                          return (
                            <Dropdown.Item key={order_item.id}>
                              {order_item.quantity} x {order_item.item.title}
                            </Dropdown.Item>
                          )
                        })}
                        {cart && cart.order_items.length < 1 ? ( <Dropdown.Item>No items in your cart</Dropdown.Item> ) :null }
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          icon='arrow right' 
                          text='Chechout'
                          onClick={() => this.props.history.push('/order-summary')} 
                        />
                      </Dropdown.Menu>
                    </Dropdown>
                    <Menu.Item header onClick={() => {this.props.logout(); this.props.logoutReload() }}>
                      Logout
                    </Menu.Item>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Link to="/login">
                        <Menu.Item header>Login</Menu.Item>
                      </Link>
                      <Link to="/signup">
                        <Menu.Item header>Signup</Menu.Item>
                      </Link>
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
              <Header as='h4' inverted>
                Footer Header
              </Header>
              <p>
                Extra space for a call to action inside the footer that could help re-engage users.
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.auth.token !== null,
    cart: state.cart.shoppingCart,
    loading: state.cart.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout()),
    logoutReload: () => dispatch(logoutReload()),
    fetchCart: () => dispatch(fetchCart())
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CustomLayout)
);
