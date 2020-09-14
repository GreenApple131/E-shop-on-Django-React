import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Container,
  Dimmer,
  Header,
  Icon,
  Image,
  Label,
  Loader,
  Message,
  Segment,
  Table,
} from "semantic-ui-react";
import { Link, Redirect } from "react-router-dom";
import { authAxios } from "../utils";
import {
  addToCartURL,
  orderSummaryURL,
  orderItemDeleteURL,
  orderItemUpdateQuantityURL,
} from "../constants";

class OrderSummary extends React.Component {
  state = {
    data: null,
    error: null,
    loading: false,
  };

  componentDidMount() {
    this.handleFetchOrder();
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

  renderVariations = (orderItem) => {
    let text = "";
    orderItem.size.forEach((iv) => {
      text += `${iv.name}: ${iv.size}, `;
    });
    return text;
  };

  handleFormatData = (size) => {
    // парситься size, тому що поки що в моделі реалізовано тільки розмір. Колір можна додати в майбутньому
    // convert [{id: 1}, {id: 2}] to [1,2] - they're all variations
    return Object.keys(size).map((key) => {
      return size[key].id;
    });
  };

  handleAddToCart = (slug, size) => {
    // парситься size, тому що поки що в моделі реалізовано тільки розмір. Колір можна додати в майбутньому
    this.setState({ loading: true });
    const variations = this.handleFormatData(size);

    authAxios
      .post(addToCartURL, { slug, variations })
      .then((res) => {
        this.handleFetchOrder(); // update the cart count

        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleRemoveQuantityFromCart = (slug) => {
    authAxios
      .post(orderItemUpdateQuantityURL, { slug })
      .then((res) => {
        // callback
        this.handleFetchOrder();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  handleRemoveItem = (itemID) => {
    authAxios
      .delete(orderItemDeleteURL(itemID))
      .then((res) => {
        // callback
        this.handleFetchOrder();
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  };

  render() {
    const { data, error, loading } = this.state;
    console.log(data);

    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }

    return (
      <Container style={{ marginTop: "10px", marginBottom: "10px" }}>
        <Header>Order Summary</Header>
        {error && (
          <Message
            error
            header="There was an error"
            content={JSON.stringify(error)}
          />
        )}
        {loading && (
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        {data && (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Item №</Table.HeaderCell>
                <Table.HeaderCell>Item name</Table.HeaderCell>
                <Table.HeaderCell>Item price</Table.HeaderCell>
                <Table.HeaderCell>Item quantity</Table.HeaderCell>
                <Table.HeaderCell>Total item price</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {data.order_items.map((orderItem, i) => {
                i += 1;
                return (
                  <Table.Row key={orderItem.id}>
                    <React.Fragment>
                      <Table.Cell>{i}</Table.Cell>
                      <Table.Cell>
                        {orderItem.item.title} -{" "}
                        {this.renderVariations(orderItem)}
                      </Table.Cell>
                      <Table.Cell>${orderItem.item.price}</Table.Cell>
                      <Table.Cell textAlign="center">
                        <Icon
                          name="minus"
                          style={{ float: "left", cursor: "pointer" }}
                          onClick={() =>
                            this.handleRemoveQuantityFromCart(orderItem.item.slug)
                          }
                        />
                        {orderItem.quantity}
                        <Icon
                          name="plus"
                          style={{ float: "right", cursor: "pointer" }}
                          onClick={() =>
                            this.handleAddToCart(
                              orderItem.item.slug,
                              orderItem.size
                            )
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        {orderItem.item.discount_price && (
                          <Label color="green" ribbon>
                            ON DISCOUNT
                          </Label>
                        )}
                        ${orderItem.final_price}
                        <Icon
                          name="trash"
                          color="red"
                          style={{ float: "right", cursor: "pointer" }}
                          onClick={() => this.handleRemoveItem(orderItem.id)}
                        />
                      </Table.Cell>
                    </React.Fragment>
                  </Table.Row>
                );
              })}
              <Table.Row>
                <Table.Cell />
                <Table.Cell />
                <Table.Cell />
                <Table.Cell colSpan="2" textAlign="center">
                  Total: ${data.total}
                </Table.Cell>
              </Table.Row>
            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell colSpan="5" textAlign="right">
                  <Link to="/checkout">
                    <Button floated="right" color="yellow">
                      Checkout
                    </Button>
                  </Link>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(OrderSummary);
