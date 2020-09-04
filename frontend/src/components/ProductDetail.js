import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Grid,
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
    data: [],
  };

  componentDidMount() {
    this.handleFetchItem();
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
    const { data, error, loading } = this.state;
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
        <Grid columns={2} divided style={{ marginTop: "5px", marginBottom: "10px"}}>
          <Grid.Row>
            <Grid.Column>
              <Card
                fluid
                image={item.image}
                header={item.title}
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
                      onClick={() => this.handleAddToCart(item.slug)}
                    >
                      Add to cart
                      <Icon name="cart plus" />
                    </Button>
                  </React.Fragment>
                }
              />
            </Grid.Column>
            <Grid.Column>
              <Header as="h2">Try different variations</Header>
              {data.variations &&
                data.variations.map((v) => {
                  return (
                    <React.Fragment key={v.id}>
                      <Header as="h3">{v.name}</Header>
                      <Item.Group divided >
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
                })}
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
