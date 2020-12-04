import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { mediaURL, productListURL } from "../constants";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Divider,
  Header,
  Icon,
  Image,
  Loader,
  Message,
  Sidebar,
  Segment,
  Visibility,
} from "semantic-ui-react";
import { fetchCart } from "../store/actions/cart";
import { createMedia } from "@artsy/fresnel";
import ElementsCard from "./ElementsCard";
import "../App.css";

// slider
// import { Carousel } from 'react-responsive-carousel'
import Slider from "react-animated-slider";
import "react-animated-slider/build/horizontal.css";
// import 'normalize.css/normalize.css'
import "./elements/sliderStyles.css";
import "./elements/slider-animations.css";

const Background = mediaURL + "background.jpg";
const Background2 = mediaURL + "background2.jpg";
const Background3 = mediaURL + "background3.jpg";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

/* Heads up!
 * HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled
 * components for such things.
 */
const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Header
      as="h1"
      content="Imagine-a-Company"
      inverted
      style={{
        fontSize: mobile ? "2em" : "4em",
        fontWeight: "normal",
        marginBottom: -700,
        marginTop: mobile ? "1.5em" : "3em",
      }}
    />
    <Header
      as="h2"
      content="Do whatever you want when you want to."
      inverted
      style={{
        fontSize: mobile ? "1.5em" : "1.7em",
        fontWeight: "normal",
        marginTop: mobile ? "0.5em" : "1.5em",
      }}
    />
    <Button primary size="huge">
      Get Started
      <Icon name="right arrow" />
    </Button>
  </Container>
);

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
};

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */

class DesktopContainer extends Component {
  state = {
    loading: false,
    error: null,
    data: [],
  };

  async componentDidMount() {
    this.setState({ loading: true });

    // this.props.fetchCart(); // update the cart count

    const res = await axios
      .get(productListURL)
      .then((res) => {
        console.log("res.data",res.data.results);
        this.setState({ data: res.data.results, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }

  hideFixedMenu = () => this.setState({ fixed: false });
  // showFixedMenu = () => this.setState({ fixed: true })

  render() {
    const { children } = this.props;
    const { data, error, loading } = this.state;
    let renderFivePopularElements = 1;
    let renderFiveDiscountElements = 1;
    let renderFiveNewElements = 1;

    const content = [
      {
        title: "WELCOME",
        description: "BUY ONLINE : WWW.ESHOP.COM",
        button: "Buy now!",
        redirectLink: "products",
        image: Background,

        // user: 'Luan Gjokaj',
        // userProfile: 'https://i.imgur.com/JSW6mEk.png'
      },
      {
        title: "OUR VISION AND GOAL",
        description: "Our believes in a Malaysian future where IT…",
        button: "Discover",
        redirectLink: "login",
        image: Background2,
        // user: 'Erich Behrens',
        // userProfile: 'https://i.imgur.com/0Clfnu7.png'
      },
      {
        title: "BUSINESS ACTIVITIES",
        description:
          "Due to the rapid change of the Information Technology industry,…",
        button: "Read More",
        redirectLink: "signup", // link to redirect page
        image: Background3,
        // user: 'Bruno Vizovskyy',
        // userProfile: 'https://i.imgur.com/4KeKvtH.png'
      },
    ];

    return (
      <Media greaterThan="mobile">
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          {/* <Container> */}
          <Segment
            inverted
            textAlign="center"
            style={{ maxHeight: 700, padding: "0em 0em" }}
            vertical
          >
            <Slider className="slider-wrapper">
              {content.map((item, index) => (
                <div
                  key={index}
                  className="slider-content"
                  // style={{ background: `url('${item.image}') no-repeat center center` }}
                  style={{ background: `url(${item.image})` }}
                >
                  <div
                    className="inner"
                    style={{ height: "auto", width: "100%" }}
                  >
                    <h1>{item.title}</h1>
                    <p>{item.description}</p>
                    <Link to={item.redirectLink}>
                      <button>{item.button}</button>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
            {/* <HomepageHeading /> */}
          </Segment>
          {/* </Container> */}
        </Visibility>

        {/* <ProductList /> */}

        <Container style={{ marginTop: "10px", marginBottom: "10px" }}>
          {error && ( // if error then do smth after &&
            <Message
              error
              header="There was some errors with your submission"
              content={JSON.stringify(error)}
            />
          )}

          <Header
            textAlign="center"
            style={{
              marginTop: 20,
              margin: 10,
              fontFamily: "monospace",
              fontSize: 32,
            }}
          >
            Popular Items
          </Header>
          <Divider />
          {/* <SearchFilter /> */}
          {loading && ( // if loading then do smth after &&
            <Segment>
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>

              <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
            </Segment>
          )}

          {/* <SearchFilterResults value={this.props.value} /> */}

          {/* Card Group   discount/new/popular...    */}
          <Card.Group>
            {data.map((item, x) =>
              item.other_marks.map((m) =>
                m.mark === "popular" ? (
                  // if "discount" render it
                  // <React.Fragment key={j}>{item.title} {i} </React.Fragment>
                  <React.Fragment>
                    {renderFivePopularElements !== 6 &&
                      renderFivePopularElements++ && (
                        <ElementsCard key={x} {...item}></ElementsCard>
                      )}
                  </React.Fragment>
                ) : (
                  <React.Fragment />
                )
              )
            )}
          </Card.Group>

          <Divider />

          {/* new element */}

          <Header
            textAlign="center"
            style={{
              marginTop: 20,
              margin: 10,
              fontFamily: "monospace",
              fontSize: 32,
            }}
          >
            Top Discount
          </Header>
          <Divider />
          {/* <SearchFilter /> */}
          {loading && ( // if loading then do smth after &&
            <Segment>
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>

              <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
            </Segment>
          )}

          {/* <SearchFilterResults value={this.props.value} /> */}

          {/* Card Group   discount/new/popular...    */}
          <Card.Group>
            {data.map((item, x) =>
              item.other_marks.map((m, j) =>
                m.mark === "discount" ? (
                  // if "discount" render it
                  <React.Fragment>
                    {renderFiveDiscountElements !== 6 &&
                      renderFiveDiscountElements++ && (
                        <ElementsCard key={x} {...item}></ElementsCard>
                      )}
                  </React.Fragment>
                ) : (
                  <React.Fragment />
                )
              )
            )}
          </Card.Group>
          <Divider />

          {/* new element */}

          <Header
            textAlign="center"
            style={{
              marginTop: 20,
              margin: 10,
              fontFamily: "monospace",
              fontSize: 32,
            }}
          >
            New Items
          </Header>
          <Divider />
          {/* <SearchFilter /> */}
          {loading && ( // if loading then do smth after &&
            <Segment>
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>

              <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
            </Segment>
          )}

          {/* <SearchFilterResults value={this.props.value} /> */}

          {/* Card Group   discount/new/popular...    */}
          <Card.Group>
            {data.map((item, x) =>
              item.other_marks.map((m, j) =>
                m.mark === "new" ? (
                  // if "new" render it with limit !!! 5 !!! first elements
                  <React.Fragment>
                    {renderFiveNewElements !== 6 && renderFiveNewElements++ && (
                      <ElementsCard key={x} {...item}></ElementsCard>
                    )}
                  </React.Fragment>
                ) : (
                  <React.Fragment />
                )
              )
            )}
          </Card.Group>
        </Container>

        {children}
      </Media>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <Media as={Sidebar.Pushable} at="mobile">
        <Segment
          inverted
          textAlign="center"
          style={{
            minHeight: 700,
            padding: "1em 0em",
            width: "100%",
            height: "100%",
            backgroundImage: `url(${Background})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "noRepeat",
          }}
          vertical
        >
          <HomepageHeading />
        </Segment>

        {children}
      </Media>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
};

const ResponsiveContainer = ({ children }) => (
  /* Heads up!
   * For large applications it may not be best option to put all page into these containers at
   * they will be rendered twice for SSR.
   */
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </MediaContextProvider>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(DesktopContainer);
