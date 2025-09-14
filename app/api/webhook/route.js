import { supabase } from "@/supabse_client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Convert stream to buffer
async function getRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export async function POST(req) {
  const rawBody = await getRawBody(req.body);
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

  try {
    if (event.type === "customer.subscription.created") {
      const subscriptionData = event.data.object;
      await supabase.from("subscriptions").insert([
        {
          sub_id: subscriptionData.id,
          user_id: subscriptionData.metadata.userId,
        },
      ]);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Webhook processing error:", err.message);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
