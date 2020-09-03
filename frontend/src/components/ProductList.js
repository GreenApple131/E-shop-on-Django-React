import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { 
  Button, 
  Container, 
  Dimmer, 
  Icon, 
  Image, 
  Item, 
  Label, 
  Loader, 
  Message, 
  Segment 
} from 'semantic-ui-react';
import { productListURL, addToCartURL } from '../constants';
import { authAxios } from '../utils';
import { fetchCart } from '../store/actions/cart';


class Home extends Component {

  state = {
    loading: false,
    error: null,
    data: [],
  }


  async componentDidMount() {
    this.setState({ loading: true });

    this.props.fetchCart(); // update the cart count
    
    const res = await axios.get(productListURL)
    .then(res => {
      console.log(res.data);
      this.setState({ data: res.data, loading: false });
    })
    .catch(err => {
      this.setState({ error: err, loading: false });
    })
    
  }

  

  handleAddToCart = slug => {
    this.setState({ loading: true });
    
    authAxios
      .post(addToCartURL, { slug })
      .then(res => {

        this.props.fetchCart(); // update the cart count

        this.setState({ loading: false });
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      })
  }



  render() {
    const { data, error, loading } = this.state;
    
    return (
      <Container>
        {error && ( // if error then do smth after &&
          <Message
            error
            header='There was some errors with your submission'
            content={JSON.stringify(error)}
          />
        )}
        {loading && ( // if loading then do smth after &&
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
          </Segment>
        )}
        <div className="container">
          <h2 className="center">Our items</h2>
        </div>
        <Item.Group divided>
          {this.state.data.map(item => {
            return (
              <Item key={item.id}>
                <Item.Image src={item.image} />
                <Item.Content>
                  <Item.Header 
                    as='a' 
                    onClick={() => this.props.history.push(`/products/${item.id}`)}
                  >
                    {item.title}
                  </Item.Header>
                  <Item.Meta>
                    <span className='cinema'>{item.category}</span>
                  </Item.Meta>
                  <Item.Description>{item.description}</Item.Description>
                  <Item.Extra>
                    <Button primary floated='right' icon labelPosition='right' onClick={() => this.handleAddToCart(item.slug)}>
                      Add to cart
                      <Icon name='cart plus' />
                    </Button>
                    {item.discount_price && 
                      <Label color={item.label === "primary" ? "blue": item.label === "secondary" ? "green": "olive"}>
                        {item.label}
                      </Label>}
                  </Item.Extra>
                </Item.Content>
              </Item>
            )
          })}
        </Item.Group>
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCart: () => dispatch(fetchCart())
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Home);