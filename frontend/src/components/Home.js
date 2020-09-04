import React, { Component } from "react"
import { Link } from 'react-router-dom'
import '../App.css'
import PropTypes from "prop-types"
import { createMedia } from '@artsy/fresnel'
import { mediaURL } from '../constants'
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Segment,
  Sidebar,
  Visibility,
} from "semantic-ui-react"
// slider
// import { Carousel } from 'react-responsive-carousel'
import Slider from 'react-animated-slider'
import 'react-animated-slider/build/horizontal.css'
// import 'normalize.css/normalize.css'
import './elements/sliderStyles.css'
import './elements/slider-animations.css'


const Background = mediaURL + 'background.jpg'
const Background2 = mediaURL + 'background2.jpg'
const Background3 = mediaURL + 'background3.jpg'

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

/* Heads up!
 * HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled
 * components for such things.
 */
const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Header
      as='h1'
      content='Imagine-a-Company'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: -700,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='Do whatever you want when you want to.'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <Button primary size='huge'>
      Get Started
      <Icon name='right arrow' />
    </Button>
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */

class DesktopContainer extends Component {
  state = {}

  hideFixedMenu = () => this.setState({ fixed: false })
  // showFixedMenu = () => this.setState({ fixed: true })

  render() {
    const { children } = this.props
    const { fixed } = this.state

    const content = [
      {
        title: 'ONLINE SHOP',
        description:
        'BUY ONLINE : WWW.ESHOP.COM',
        button: 'Buy now!',
        redirectLink: 'products',
        image: Background,
        // user: 'Luan Gjokaj',
        // userProfile: 'https://i.imgur.com/JSW6mEk.png'
      },
      {
        title: 'OUR VISION AND GOAL',
        description:
        'Our believes in a Malaysian future where IT…',
        button: 'Discover',
        redirectLink: 'login',
        image: Background2,
        // user: 'Erich Behrens',
        // userProfile: 'https://i.imgur.com/0Clfnu7.png'
      },
      {
        title: 'BUSINESS ACTIVITIES',
        description:
        'Due to the rapid change of the Information Technology industry,…',
        button: 'Read More',
        redirectLink: 'signup',    // link to redirect page
        image: Background3,
        // user: 'Bruno Vizovskyy',
        // userProfile: 'https://i.imgur.com/4KeKvtH.png'
      }
    ];

    return (
      <Media greaterThan='mobile'>
        <Visibility 
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            inverted
            textAlign='center'
            style={{ maxHeight: 700, padding: '0em 0em',
          }}
            vertical
          >
            <Slider className="slider-wrapper">
              {content.map((item, index) => (
                <div
                key={index}
                className="slider-content"
                // style={{ background: `url('${item.image}') no-repeat center center` }}
                style={{ background: `url(${item.image})`}}
                >
                  <div className="inner" style={{height:'auto', width:'100%'}}>
                    <h1>{item.title}</h1>
                    <p>{item.description}</p>
                    <Link to={item.redirectLink}>
                      <button >{item.button}</button>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
            {/* <HomepageHeading /> */}
          </Segment>
        </Visibility>

        {children}
      </Media>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component {
  state = {}

  handleSidebarHide = () => this.setState({ sidebarOpened: false })

  handleToggle = () => this.setState({ sidebarOpened: true })

  render() {
    const { children } = this.props
    const { sidebarOpened } = this.state

    return (
      <Media as={Sidebar.Pushable} at='mobile'>
        <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 700, padding: '1em 0em',
              width: "100%", height: "100%", backgroundImage: `url(${Background})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              backgroundRepeat: 'noRepeat',
            }}
            vertical
          >
            <HomepageHeading />
          </Segment>

            {children}

      </Media>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
  /* Heads up!
   * For large applications it may not be best option to put all page into these containers at
   * they will be rendered twice for SSR.
   */
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </MediaContextProvider>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

const HomepageLayout = () => (
  <ResponsiveContainer>
    

  </ResponsiveContainer>
)


export default (HomepageLayout);

