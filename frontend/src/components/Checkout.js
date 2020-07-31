import React, { Component } from "react";
import {Link, withRouter } from 'react-router-dom';
import {
  Button,
  Container,
  Form,
  Header,
  Label,
  Menu,
  Message,
  Table,
} from "semantic-ui-react";
import { authAxios } from "../utils";
import { checkoutURL } from "../constants";

import { Elements, CardElement, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { injectStripe, StripeProvider } from "react-stripe-elements";

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
};


class CheckoutForm extends Component {
  state = {
    loading: false,
    error: null,
    success: false,
  };

  handleSubmit = (event) => {
    // Block native form submission.
    event.preventDefault();
    this.setState({loading: true});


    // if (this.props.stripe) {
      this.props.stripe.createToken().then(result => {
        if (result.error) {
          this.setState({ error: result.error.message, loading: false });
        } else {
          this.setState({ error: null });
          authAxios
            .post(checkoutURL, { stripeToken: result.token.id })
            .then(res => {
              this.setState({ loading: false, success: true });
            })
            .catch(err => {
              this.setState({ loading: false, error: err });
            });
        }
      });
    // } else {
      // console.log("Stripe is not loaded");
    // }
  };



  render() {
    const { error, loading, success } = this.state;

    return (
      <Form onSubmit={this.handleSubmit}>
        <div className="form-row">
          {error && (
            <Message negative>
              <Message.Header>Your payment was unsuccessfull</Message.Header>
              <p>{JSON.stringify(error)}</p>
            </Message>
          )}
          {success && (
            <Message positive>
              <Message.Header>Your payment was successfull</Message.Header>
              <p>
                Go to your <b>profile</b> to see the delivery status.
              </p>
            </Message>
          )}
          <label htmlFor="card-element">
            Would You like to complete the purchase?
          </label>
          <CardSection />
          <Button
            primary
            onClick={this.handleSubmit}
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
    );
  }
}

const stripePromise = loadStripe(
  "pk_test_51H1x1XK0Ldnw408vCnlxLh9TE6mVqne7mdVIEVNEjNwjq7DQykAoahTgxxKxewywBRtFR5LzWuVf144nmfNJnEGL00ERtZWTKx"
);
const stripeApi = 'pk_test_51H1x1XK0Ldnw408vCnlxLh9TE6mVqne7mdVIEVNEjNwjq7DQykAoahTgxxKxewywBRtFR5LzWuVf144nmfNJnEGL00ERtZWTKx'

const InjectedForm = withRouter(injectStripe(CheckoutForm));

const Checkout = () => (
  <Container text>
      <div>
        <h1>Complete your order</h1>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
  </Container>
);

export default Checkout;
