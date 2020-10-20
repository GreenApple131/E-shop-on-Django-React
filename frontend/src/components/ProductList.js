import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Grid,
  Icon,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Segment,
} from "semantic-ui-react";
import { productListURL, addToCartURL } from "../constants";
import { authAxios } from "../utils";
import { fetchCart } from "../store/actions/cart";

class ProductList extends Component {
  state = {
    loading: false,
    error: null,
    data: [],
  };

  async componentDidMount() {
    this.setState({ loading: true });

    this.props.fetchCart(); // update the cart count

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

  handleAddToCart = (slug) => {
    this.setState({ loading: true });

    authAxios
      .post(addToCartURL, { slug })
      .then((res) => {
        this.props.fetchCart(); // update the cart count

        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  render() {
    const { error, loading } = this.state;

    return (
      <Container style={{marginTop: "10px", marginBottom: "10px"}}>
        {error && ( // if error then do smth after &&
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {loading && ( // if loading then do smth after &&
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        <div className="container">
          <h2 className="center">Our items</h2>
        </div>
        <Grid doubling columns={5} style={{marginTop: "10px", marginBottom: "10px"}}>
          {this.state.data.map((item) => {
            return (
              <Grid.Column key={item.id}>
                <Card style={{width: '300px', height: '400px'}}>
                  <Image 
                    src={item.image} 
                    style={{width: '300px', height: '250px'}}
                    wrapped ui={true}
                    as="a"
                    onClick={() =>
                      this.props.history.push(`/products/${item.slug}`)
                    } 
                  />
                  <Card.Content>
                    <Item.Header
                      as="a"
                      onClick={() =>
                        this.props.history.push(`/products/${item.slug}`)
                      }
                    >
                      {item.title} {"  "}
                      {item.discount_price && ( // always show, not just when there is a discount
                        <Label
                          color='violet'
                        >
                          discount
                        </Label>
                      )}
                    </Item.Header>
                    <Card.Meta>
                      {item.category}
                    </Card.Meta>
                    <Card.Description>{item.description}</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <React.Fragment>
                      {item.discount_price && (
                        <Button color='black' floated="left"><small><strike>${item.price}</strike></small> ${item.discount_price}</Button>
                      )}
                      {!item.discount_price && (
                        <small>${item.price}</small>
                      )}
                      <Button
                        animated='vertical'
                        color="black"
                        floated="right"
                        onClick={() => this.handleAddToCart(item.slug)}
                      >
                        <Button.Content hidden>Buy</Button.Content>
                        <Button.Content visible>
                          <Icon name="cart plus" />
                        </Button.Content>
                      </Button>
                    </React.Fragment>
                  </Card.Content>
                </Card>
              </Grid.Column>
            );
          })}
        </Grid>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(ProductList);
