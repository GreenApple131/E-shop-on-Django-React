import React, { Component } from 'react'
import axios from 'axios';
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
import {productListURL} from '../constants'


class ProductList extends Component {

  state = {
    loading: false,
    error: null,
    data: [],

  }

  // async componenDidMount() {
  //   this.setState({ loading: true });
  //   // const res = await fetch('http://127.0.0.1:8000/api/product-list/'); // fetching the data from api, before the page loaded
  //   // const data = await res.json();
  //   axios
  //   .fetch(productListURL)
  //   .then(res => {
  //     console.log(res.data);
  //     this.setState({ data: res.data, loading: false });
  //   })
  //   .catch(err => {
  //     this.setState({ error: err, loading: false });
  //   });
  // }

  async componentDidMount() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/product-list/'); // fetching the data from api, before the page loaded
      const data = await res.json();
      this.setState({
        data
      });
    } catch (e) {
      console.log(e);
    }
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
        <Item.Group divided>
          {this.state.data.map(item => {

            return <Item key={item.id}>
              <Item.Image src={item.image} />
              <Item.Content>
                <Item.Header as='a'>{item.title}</Item.Header>
                <Item.Meta>
                  <span className='cinema'>{item.category}</span>
                </Item.Meta>
                <Item.Description>{item.description}</Item.Description>
                <Item.Extra>
                  <Button primary floated='right' icon labelPosition='right' >
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
          })}
        </Item.Group>
      </Container>
    );
  }
}


export default ProductList