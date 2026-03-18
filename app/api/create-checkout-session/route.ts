import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

function calculateAmount(attendeeCount: number) {
  const pricePerPerson = 25; // change this to your real amount
  return attendeeCount * pricePerPerson * 100; // cents
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const firstName = String(body.firstName || "").trim();
  const lastName = String(body.lastName || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const attendeeCount = Number(body.attendeeCount || 1);

  if (!firstName || !lastName || !email || attendeeCount < 1) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const amount = calculateAmount(attendeeCount);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "SGVP Gurukul USA Walk-A-Thon Registration"
          },
          unit_amount: amount
        },
        quantity: 1
      }
    ],
    metadata: {
      firstName,
      lastName,
      email,
      phone,
      attendeeCount: String(attendeeCount)
    }
  });

  return NextResponse.json({ url: session.url });
}