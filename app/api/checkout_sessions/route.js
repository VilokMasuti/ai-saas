import Stripe from 'stripe'
import { supabase } from '@/supabse_client'
import { NextResponse } from 'next/server'
import url from 'url'
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export async function POST(request) {
  const { email, userId } = await request.json()
  try {
    const { protocol, host } = url.parse(request.url)
    const baseUrl = `${protocol}//${host}`
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      payment_method_types: ['card'],
      subscription_data: {
        metadata: {
          userId,
        },
      },
      line_items: [{ price: 'price_1QFA4XSJLLjkaG3SW3RXMw61', quantity: 1 }],
      mode: 'subscription',
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel?session_id={CHECKOUT_SESSION_ID}`,
    })
    return NextResponse.json(session, { status: 200 })
  } catch (error) {
    return NextResponse.json(error, { status: 500 })
  }
}
