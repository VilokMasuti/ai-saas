import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function POST(req) {
  const { email, userId } = await req.json();

  try {
    const { origin } = new URL(req.url);

    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ["card"],
      subscription_data: {
        metadata: { userId },
      },
      line_items: [
        {
          price: "price_1S797FGi9t2xsAx39lUt6DCJ", // ✅ make sure this is valid
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.error("Stripe session creation failed:", error.message);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
