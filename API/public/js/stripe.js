/*eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe('pk_test_wpj8LHiUOFMh6fHze9zReU7R00dkBMfkMf');

export const bookTour = async (tourId) => {
  try {
    // 1. Get the session from the server
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // 2. Create checkout form  + charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
