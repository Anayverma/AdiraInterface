import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from 'react';
export async function checkout({ lineItems, customerName, customerAddress }) {
    let stripePromise = null;

    const getStripe = () => {
        if (!stripePromise) {
            stripePromise = loadStripe(process.env.NEXT_PUBLIC_API_KEY);
        }
        return stripePromise;
    };

    try {
        const stripe = await getStripe();

        const session = await stripe.redirectToCheckout({
            mode: "payment",
            lineItems,
             // Replace with actual customer email
            billingAddressCollection: 'required',
            shippingAddressCollection: {
                allowedCountries: ['US'], // Restrict to India (or relevant countries)
            },
            successUrl: `${window.location.origin}/successpay/S{CHECKOUT_SESSION_ID}`,
            cancelUrl: `${window.location.origin}/successpay/F{CHECKOUT_SESSION_ID}`
        });
    } catch (error) {
        console.error("Error during checkout:", error);
    }
}