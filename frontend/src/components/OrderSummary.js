import React from "react";
import {
  Button,
  Container,
  Dimmer,
  Header,
  Image,
  Label,
  Loader,
  Message,
  Segment,
  Table,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { authAxios } from "../utils";
import { orderSummaryURL } from "../constants";

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

  render() {
    const { data, error, loading } = this.state;
    console.log(data);
    return (
      <Container style={{marginTop: "10px", marginBottom: "10px"}}>
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
								i+=1
                return (
                  <Table.Row key={orderItem.id}>
                    <React.Fragment>
                      <Table.Cell>{i}</Table.Cell>
                      <Table.Cell>{orderItem.item.title}</Table.Cell>
                      <Table.Cell>${orderItem.item.price}</Table.Cell>
                      <Table.Cell>{orderItem.quantity}</Table.Cell>
                      {orderItem.item.discount_price && (
                        <Label color="green" ribbon>
                          ON DISCOUNT
                        </Label>
                      )}
                      ${orderItem.final_price}
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

export default OrderSummary;
