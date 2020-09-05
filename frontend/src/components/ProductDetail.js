import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Divider,
  Grid,
  Form,
  Header,
  Icon,
  Item,
  Image,
  Label,
  Loader,
  Message,
  Segment,
} from "semantic-ui-react";
import { localhost, productDetailURL, addToCartURL } from "../constants";
import { authAxios } from "../utils";
import { fetchCart } from "../store/actions/cart";

class ProductDetail extends Component {
  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
  };

  componentDidMount() {
    this.handleFetchItem();
  }

  handleToggleForm = () => {
    const {formVisible} = this.state;
    this.setState({
      formVisible: !formVisible
    })
  }

  handleFetchItem = () => {
    const {
      match: { params },
    } = this.props;
    this.setState({ loading: true });
    this.props.fetchCart(); // update the cart count
    axios
      .get(productDetailURL(params.productID))
      .then((res) => {
        console.log(res.data);
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

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
    const { data, error, formVisible, loading } = this.state;
    const item = data;
    return (
      <Container>
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
        <Grid
          columns={2}
          divided
          style={{ marginTop: "5px", marginBottom: "10px" }}
        >
          <Grid.Row>
            <Grid.Column>
            <Card fluid>
              <Card.Content>
                <Header textAlign='center' as='h1'>{item.title}</Header>
                <Image src={item.image} wrapped ui={true} />
                <Card.Meta>
                  <React.Fragment>
                    {item.category}
                    {item.discount_price && ( // always show, not just when there is a discount
                      <Label
                        color={
                          item.label === "primary"
                            ? "blue"
                            : item.label === "secondary"
                            ? "green"
                            : "olive"
                        }
                      >
                        {item.label}
                      </Label>
                    )}
                  </React.Fragment>
                </Card.Meta>
                <Card.Description>
                  <Header as='b' textAlign='center'>Select Size:</Header>
                  <br />
                  <Segment>
                    <Button.Group >
                      <Button color='black'>XS</Button>
                      <Button >S</Button>
                      <Button >M</Button>
                      <Button >L</Button>
                      <Button >XL</Button>
                      <Button >XXL</Button>
                    </Button.Group>
                  </Segment>
                </Card.Description>
              </Card.Content>
              <Divider />
              <Card.Content extra>
                    <React.Fragment>
                      {item.discount_price && (
                        <Button color='black' floated="left"><small><strike>${item.price}</strike></small> ${item.discount_price}</Button>
                      )}
                      {!item.discount_price && (
                        <Button color='black' floated="left" >${item.price}</Button>
                      )}
                      <Button
                        animated='vertical'
                        color="black"
                        floated="right"
                        onClick={this.handleToggleForm}
                      >
                        <Button.Content hidden>
                          <Icon name="cart plus" />
                        </Button.Content>
                        <Button.Content visible>
                          Add to cart
                        </Button.Content>
                      </Button>
                    </React.Fragment>
                  </Card.Content>
            </Card>
              {/* <Card
                fluid
                image={item.image}
                header={
                  <Header textAlign='center' as="h1">
                    {item.title}
                    <Divider />
                  </Header>
                }
                meta={
                  <React.Fragment>
                    {item.category}
                    {item.discount_price && ( // always show, not just when there is a discount
                      <Label
                        color={
                          item.label === "primary"
                            ? "blue"
                            : item.label === "secondary"
                            ? "green"
                            : "olive"
                        }
                      >
                        {item.label}
                      </Label>
                    )}
                  </React.Fragment>
                }
                description={item.description}
                extra={
                  <React.Fragment>
                    <Button
                      fluid
                      color="google plus"
                      floated="right"
                      icon
                      labelPosition="right"
                      onClick={this.handleToggleForm}
                    >
                      Add to cart
                      <Icon name="cart plus" />
                    </Button>
                  </React.Fragment>
                }
              /> */}
              {formVisible && (
                <React.Fragment>
                  <Divider />
                  <Form>
                    <Form.Field />
                    <Form.Button onClick={() => this.handleAddToCart(item.slug)}>
                      Submit
                    </Form.Button>
                  </Form>
                </React.Fragment>
              )}
            </Grid.Column>
            <Grid.Column>
              <Header as="h2">Description</Header>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pulvinar auctor urna vitae tincidunt. Nam ut vestibulum dolor, sit amet lobortis orci. Curabitur sollicitudin nisl sed feugiat vulputate. Vivamus eu vehicula leo, eleifend porta nunc. Sed nec turpis sit amet purus tincidunt bibendum vel vel ligula. Nulla consequat eu neque ac consequat. In tristique condimentum erat. Duis eu sapien viverra, finibus ex sed, egestas libero.</p>
              <p>Nullam lorem nisi, fringilla ac rhoncus viverra, accumsan eget tellus. Praesent elementum purus eget est molestie hendrerit. Aenean ac scelerisque nibh. Donec lobortis eros in ante condimentum euismod et eu metus. Proin consectetur id odio ut blandit. Cras vestibulum sagittis sapien non lobortis. Fusce rutrum nulla est, vel scelerisque purus bibendum vel. Vestibulum a odio finibus, tempor massa id, accumsan libero. Ut venenatis vel lorem ut fermentum. Aenean aliquam dolor pellentesque, pretium magna at, luctus velit. Pellentesque id consequat justo. Sed nec ligula in libero ultricies bibendum quis sit amet libero.</p>
              {/* {data.variations &&
                data.variations.map((v) => {
                  return (
                    <React.Fragment key={v.id}>
                      <Header as="h3">{v.name}</Header>
                      <Item.Group divided>
                        {v.item_variations.map((iv) => {
                          return (
                            <Item key={iv.id}>
                              {iv.attachment && (
                                <Item.Image
                                  size="tiny"
                                  src={`${localhost}${iv.attachment}`}
                                />
                              )}
                              <Item.Content verticalAlign="middle">
                                {iv.value}
                              </Item.Content>
                            </Item>
                          );
                        })}
                      </Item.Group>
                    </React.Fragment>
                  );
                })} */}
            </Grid.Column>
          </Grid.Row>
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

export default withRouter(connect(null, mapDispatchToProps)(ProductDetail));
