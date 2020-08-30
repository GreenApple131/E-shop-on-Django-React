import React, { Component } from "react"
// import {withRouter } from 'react-router-dom'
import {
  Button,
  Checkbox,
  Container,
  Divider,
  Dimmer,
  Form,
  Header,
  Icon,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Segment,
  Table,
} from "semantic-ui-react"
import { checkoutURL, orderSummaryURL, addCouponURL } from "../constants"
import { localhost } from "../constants"
import { authAxios } from "../utils"

import { Elements, CardElement } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { Redirect } from "react-router-dom"
// import { injectStripe } from "react-stripe-elements"

// Custom styling can be passed to options when creating an Element.
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function CardSection() {
  return (
    <label>
      Card details
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </label>
  );
}

const OrderPreview = (props) => {
    const { data } = props;
    return (
      <React.Fragment>
        {data && (
          <React.Fragment>
            <Item.Group relaxed>
              {data.order_items.map((orderItem, i) => {
                console.log(orderItem);
                i += 1;
                return (
                  <Item key={orderItem.id}>
                    <Item.Image
                      size="tiny"
                      src={`${localhost}${orderItem.item_obj.image}`}
                    />

                    <Item.Content verticalAlign="middle">
                      <Item.Header as="a">
                        {orderItem.quantity} x {orderItem.item_obj.title}
                      </Item.Header>
                      <Item.Extra>
                        <Label>${orderItem.final_price}</Label>
                      </Item.Extra>
                    </Item.Content>
                  </Item>
                );
              })}

              <Item.Group>
                <Item>
                  <Item.Content>
                    <Item.Header>Order Total: ${data.total}
                      {data.coupon && (
                        <Label color='green' style={{marginLeft: "10px"}}>
                          Current coupon: {data.coupon.code} for ${data.coupon.amount}
                        </Label> 
                      )}
                    </Item.Header>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Item.Group>
          </React.Fragment>
        )}
      </React.Fragment>
    );
}

class CouponForm extends Component {
  state = {
    code: '',
  };

  handleChange = e => {
    this.setState({ code: e.target.value });
  }

  handleSubmit = e => {
    const { code } = this.state;
    this.props.handleAddCoupon(e, code);
    this.setState({ code: "" });
  }

  render() {
    const { code } = this.state;
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Coupon code</label>
            <input placeholder="Enter a coupon.." 
                   value={code} 
                   onChange={this.handleChange}
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
      </React.Fragment>
    );
  }
}

class CheckoutForm extends Component {
  state = {
    data: null,
    loading: false,
    error: null,
    success: false,
  };

  componentDidMount() {
    this.handleFetchOrder();
  }

  handleFetchOrder = () => {
    this.setState({ loading: true });
    authAxios
      .get(orderSummaryURL)
      .then((res) => {
        console.log(res.data);
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

  handleAddCoupon = (e, code) => {
    e.preventDefault();
    this.setState({ loading: true });
    authAxios
      .post(addCouponURL, { code })
      .then(res => {
        this.setState({ loading: false });
        this.handleFetchOrder();         // refreching price after submit a right coupon
      })
      .catch(err => {
        this.setState({ error: err, loading: false });
      });
  };

  submit = (event) => {
    // Block native form submission.
    event.preventDefault();
    this.setState({ loading: true });

    if (this.props.stripe) {               // need to fix stripe
    this.props.stripe.createToken().then((result) => {
      if (result.error) {
        this.setState({ error: result.error.message, loading: false });
      } else {
        this.setState({ error: null });
        authAxios
          .post(checkoutURL, { stripeToken: result.token.id })
          .then((res) => {
            this.setState({ loading: false, success: true });
          })
          .catch((err) => {
            this.setState({ loading: false, error: err });
          });
      }
    });
    } else {                              //
    console.log("Stripe is not loaded");  //
    }                                     //
  };

  render() {
    const { data, error, loading, success } = this.state;

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          <div className="form-row">
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
            {success && (
              <Message positive>
                <Message.Header>Your payment was successfull</Message.Header>
                <p>
                  Go to your <b>profile</b> to see the delivery status.
                </p>
              </Message>
            )}

            <OrderPreview data={data} />
            <Divider />
            <CouponForm handleAddCoupon={(e, code) => this.handleAddCoupon(e, code)}/>
            <Divider />
            

            <Header htmlFor="card-element">
              Would You like to complete the purchase?
            </Header>
            <CardSection />
            <Button
              primary
              onClick={this.submit}
              // type="submit"
              loading={loading}
              disabled={loading} // cant submit twise !
              // disabled={!this.props.stripe}

              style={{ marginTop: "10px" }}
            >
              Submit
            </Button>
          </div>
        </Form>
        <Divider />
        
      </React.Fragment>
    );
  }
}

const stripePromise = loadStripe(
  "pk_test_51H1x1XK0Ldnw408vCnlxLh9TE6mVqne7mdVIEVNEjNwjq7DQykAoahTgxxKxewywBRtFR5LzWuVf144nmfNJnEGL00ERtZWTKx"
);
// const stripeApi = 'pk_test_51H1x1XK0Ldnw408vCnlxLh9TE6mVqne7mdVIEVNEjNwjq7DQykAoahTgxxKxewywBRtFR5LzWuVf144nmfNJnEGL00ERtZWTKx'

// const InjectedForm = withRouter(injectStripe(CheckoutForm));

const Checkout = () => (
  <Container text>
    <div>
      <h1>Complete your order</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
        <Divider />      
      </Elements>
    </div>
  </Container>
);

export default Checkout;
