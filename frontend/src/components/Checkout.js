import React, { Component, useState } from 'react';
import { Button, Container, Header, Label, Menu, Message, Table } from 'semantic-ui-react';
import { authAxios } from '../utils';
import axios from 'axios';
import {checkoutURL} from '../constants';

import {Elements, ElementsConsumer, useStripe, CardElement, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { injectStripe, StripeProvider } from 'react-stripe-elements';


// Custom styling can be passed to options when creating an Element.
const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    }
  };

class CheckoutForm extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         error:null
    //     }
    // }

    state = {
        loading: false,
        error: null,
        success: false
    }

    // const [error, setError] = () => this.useState(null);

    // Handle real-time validation errors from the card Element.
    handleChange = (event) => {
        if (event.error) {
            this.setError(event.error.message);
        } else {
            this.setError(null);
        }
    }
    
    handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        const {stripe, elements} = this.props;

        // Get a reference to a mounted CardElement. Elements knows how to find your
        // CardElement because there can only ever be one of each type of element.
        const cardElement = elements.getElement(CardElement);
        const result = await stripe.createToken(CardElement) // CardElement isn't necessary

        if (result.error) {
            // Inform the user if there was an error.
            this.setError(result.error.message);
          } else {
            this.setError(null);
            // Send the token to your server.
            this.stripeTokenHandler(result.token);
          }

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

    };

    // POST the token ID to your backend.
    async stripeTokenHandler(token) {
        this.setState({ loading: true });
        authAxios.post('/api/handle-payment', {token: token.id})
            .then(res => {
                this.setState({ loading: false, success: true });
            }).catch(err => {
                this.setState({ loading: false, error: err });
            })
        
    
        return this.response.json();
    }

    render() {
        const {error, loading, success} = this.state;

        return(
            <div class="form-row">
                {error  && <Message negative>
                                <Message.Header>Your payment was unsuccessfull</Message.Header>
                                <p>{JSON.stringify(error)}</p>
                            </Message>}
                {success && <Message positive>
                                <Message.Header>Your payment was successfull</Message.Header>
                                <p>
                                Go to your <b>profile</b> to see the delivery status.
                                </p>
                            </Message>}
                <label for="card-element">
                    Would You like to complete the purchase?
                </label>
                <CardElement
                    id="card-element"
                    options={CARD_ELEMENT_OPTIONS}
                    onChange={this.handleChange}
                />
                <Button 
                    primary 
                    onClick={this.handleSubmit} 
                    type="submit"
                    loading={loading}
                    disabled={loading} // cant submit twise !
                    // disabled={!this.stripe} 

                    style={{marginTop: "10px"}}
                    >
                    Submit
                </Button>
            </div>
        );
    }
}



const stripePromise = loadStripe('pk_test_51H1x1XK0Ldnw408vCnlxLh9TE6mVqne7mdVIEVNEjNwjq7DQykAoahTgxxKxewywBRtFR5LzWuVf144nmfNJnEGL00ERtZWTKx');

const InjectedCheckoutForm = injectStripe(CheckoutForm);

const Checkout = () => (
    <Container text>
        <StripeProvider apiKey={stripePromise}>
            <div>
                <h1>Complete Your order</h1>
                <Elements>
                    <InjectedCheckoutForm />
                </Elements>
            </div>
        </StripeProvider>
    </Container>
);



export default Checkout;