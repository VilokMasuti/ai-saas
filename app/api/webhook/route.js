import { NextResponse } from "next/server";
import Stripe from "stripe";
import { Readable } from "stream";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export const config = {
  api: {
    bodyParser: false, // ⛔ disables automatic parsing
  },
};

// Helper to convert stream to buffer
async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  const rawBody = await buffer(req.body);
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.warn("Missing Stripe signature");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ✅ Handle the event
  if (event.type === "customer.subscription.created") {
    const subscription = event.data.object;
    await supabase.from("subscriptions").insert([
      {
        sub_id: subscription.id,
        user_id: subscription.metadata.userId,
      },
    ]);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
