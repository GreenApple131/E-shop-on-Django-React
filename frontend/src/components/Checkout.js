import React, { cloneElement } from 'react';
import { Button, Container, Header, Label, Menu, Table } from 'semantic-ui-react';
import { authAxios } from '../utils';
import axios from 'axios';
import {chargeURL} from '../constants';

import {Elements, ElementsConsumer, useStripe, CardElement, useElements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51H1x1XK0Ldnw408vCnlxLh9TE6mVqne7mdVIEVNEjNwjq7DQykAoahTgxxKxewywBRtFR5LzWuVf144nmfNJnEGL00ERtZWTKx');

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    
    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how to find your
        // CardElement because there can only ever be one of each type of element.
        const cardElement = elements.getElement(CardElement);

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (!error) {
            console.log(paymentMethod);
            const { id } = paymentMethod;
            
            try {    // POST request here
                const { data } = await axios.post(chargeURL, {id, amount: 1099 });
                console.log(data);
            } catch (error) {
                console.log(error);
            }
        }
    };

    return(
        <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "400px", margin: "0 auto" }}
        >
            <h2>Price: $10 USD</h2>
            <CardElement />
            <button type="submit" disabled={!stripe}>
                Pay
            </button>
        </form>
    );
}


const Checkout = () => {

    return(
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}

export default Checkout;