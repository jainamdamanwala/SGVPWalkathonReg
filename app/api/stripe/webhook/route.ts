import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import QRCode from "qrcode";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { sendRegistrationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

if (event.type === "checkout.session.completed") {
  const session = event.data.object as Stripe.Checkout.Session;

  const firstName = session.metadata?.firstName || "";
  const lastName = session.metadata?.lastName || "";
  const email = session.metadata?.email || "";
  const phone = session.metadata?.phone || "";
  const attendeeCount = Number(session.metadata?.attendeeCount || 1);
  const extraShirts = Number(session.metadata?.extraShirts || 0);
  const donationAmount = Number(session.metadata?.donationAmount || 0);

  const registrationCode = `SGVP-${Date.now()}`;
  const qrCodeDataUrl = await QRCode.toDataURL(registrationCode);

  await supabaseAdmin.from("registrations").insert({
    registration_code: registrationCode,
    first_name: firstName,
    last_name: lastName,
    email,
    phone,
    attendee_count: attendeeCount,
    amount_total: session.amount_total || 0,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id: String(session.payment_intent || ""),
    payment_status: session.payment_status || "paid",
    qr_code_data_url: qrCodeDataUrl
  });

  await sendRegistrationEmail({
    to: email,
    firstName,
    lastName,
    attendeeCount,
    extraShirts,
    donationAmount,
    totalAmount: session.amount_total || 0,
    registrationCode,
    qrCodeDataUrl,
  });
}

  return NextResponse.json({ received: true });
}