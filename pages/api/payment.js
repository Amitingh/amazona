import Stripe from "stripe";
import { v4 as uuidV4 } from "uuid";
import Cart from "../../models/Cart";
import jwt from "jsonwebtoken";

const stripe = Stripe(process.env.STRIPE_SECRET);

export default async (req, res) => {
  const { paymentInfo } = req.body;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "you must have not logged" });
  }
  try {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    let price = 0;
    cart.products.forEach((item) => {
      price = price + item.quantity * item.product.price;
    });
    const prevCustomer = await stripe.customers.list({
      email: paymentInfo.email,
    });

    const isExistingCustomer = prevCustomer.data.length > 0;
    console.log(isExistingCustomer);
    let newCustomer;
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentInfo.email,
        source: paymentInfo.id,
      });
    }
    // await stripe.PaymentIntent.create(
    //   {
    //     currency: "INR",
    //     amount: price,
    //     receipt_email: paymentInfo.email,
    //     customer: isExistingCustomer ? prevCustomer.data[0].id : newCustomer.id,
    //     description: `you purchased a product | ${paymentInfo.email}`,
    //   },
    //   {
    //     idempotencyKey: uuidV4(),
    //   }
    // );
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        number: "4242424242424242",
        exp_month: 8,
        exp_year: 2023,
        cvc: "314",
      },
    });

    const paymentIntent = await stripe.paymentIntents.create(
      {
        amount: price,
        currency: "INR",
        customer: isExistingCustomer ? prevCustomer.data[0].id : newCustomer.id,
        description: `you purchased a product | ${paymentInfo.email}`,
        metadata: { integration_check: "accept_a_payment" },
        receipt_email: paymentInfo.email,
      }
      // {
      //   idempotencyKey: uuidV4(),
      // }
    );

    const paymentIntentConfirm = stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method: paymentMethod,
      }
    );

    res.status(200).json({ message: "payment was successful" });
  } catch (err) {
    // console.log(err);
    return res.status(401).json({ error: "error processing payment" });
  }
};
