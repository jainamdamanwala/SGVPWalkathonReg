import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { createRegistrationCode } from "@/lib/registration-code";
import { generateQrDataUrl } from "@/lib/qr";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing Stripe webhook configuration." }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};

    const existing = await supabaseAdmin
      .from("registrations")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (!existing.data) {
      const adults = Number(metadata.adults || 1);
      const extraShirts = Number(metadata.extraShirts || 0);
      const donationAmount = Number(metadata.donationAmount || 0);
      const shirtAmount = Number(metadata.shirtAmount || 0);
      const totalAmount = Number(session.amount_total || 0) / 100;

      const insert = await supabaseAdmin
        .from("registrations")
        .insert({
          first_name: metadata.firstName || "",
          last_name: metadata.lastName || "",
          email: session.customer_details?.email || metadata.email || "",
          phone: metadata.phone || "",
          adults,
          extra_shirts: extraShirts,
          donation_amount: donationAmount,
          shirt_amount: shirtAmount,
          total_amount: totalAmount,
          stripe_session_id: session.id,
          stripe_payment_intent_id: String(session.payment_intent || ""),
          payment_status: session.payment_status,
        })
        .select("id")
        .single();

      if (insert.error || !insert.data) {
        console.error(insert.error);
        return NextResponse.json({ received: true });
      }

      const registrationCode = createRegistrationCode(insert.data.id);
      const qrValue = JSON.stringify({
        registrationCode,
        email: session.customer_details?.email || metadata.email || "",
        adults,
      });
      const qrDataUrl = await generateQrDataUrl(qrValue);

      await supabaseAdmin
        .from("registrations")
        .update({ registration_code: registrationCode, qr_payload: qrValue })
        .eq("id", insert.data.id);

      let receiptUrl: string | null = null;
      if (session.payment_intent) {
        const paymentIntent = await stripe.paymentIntents.retrieve(String(session.payment_intent), {
          expand: ["latest_charge"],
        });
        const latestCharge = paymentIntent.latest_charge as Stripe.Charge | null;
        receiptUrl = latestCharge?.receipt_url ?? null;
      }

      const fullName = `${metadata.firstName || ""} ${metadata.lastName || ""}`.trim();
      await sendConfirmationEmail({
        to: session.customer_details?.email || metadata.email || "",
        fullName,
        registrationCode,
        adults,
        extraShirts,
        donationAmount,
        shirtAmount,
        totalAmount,
        qrDataUrl,
        receiptUrl,
      });
    }
  }

  return NextResponse.json({ received: true });
}
