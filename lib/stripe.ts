import Stripe from "stripe";

export const stripeUtil = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2023-08-16",
  typescript: true,
});