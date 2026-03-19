import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import QRCode from "qrcode";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { sendRegistrationEmail } from "@/lib/email";

console.log("🔥 WEBHOOK FILE LOADED");

export async function POST(req: NextRequest) {
  console.log("🔥 WEBHOOK HIT");

  const body = await req.text();
  console.log("🔥 BODY LENGTH:", body.length);

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  console.log("Has signature:", !!signature);
  console.log("Has webhook secret:", !!webhookSecret);

  if (!signature) {
    console.error("Missing stripe-signature header");
    return new NextResponse("Missing stripe signature", { status: 400 });
  }

  if (!webhookSecret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log("Webhook verified. Event type:", event.type);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    console.log("checkout.session.completed:", session.id);
    console.log("metadata:", session.metadata);

    const firstName = session.metadata?.firstName || "";
    const lastName = session.metadata?.lastName || "";
    const email = session.metadata?.email || "";
    const phone = session.metadata?.phone || "";
    const attendeeCount = Number(session.metadata?.attendeeCount || 1);
    const extraShirts = Number(session.metadata?.extraShirts || 0);
    const donationAmount = Number(session.metadata?.donationAmount || 0);

    try {
      const { data: existing, error: existingError } = await supabaseAdmin
        .from("registrations")
        .select("id")
        .eq("stripe_checkout_session_id", session.id)
        .maybeSingle();

      console.log("existing check result:", existing);
      console.log("existing check error:", existingError);

      if (existingError) {
        console.error("Existing-check failed:", existingError);
        return NextResponse.json({ received: false }, { status: 500 });
      }

      if (existing) {
        console.log("Duplicate webhook, already inserted");
        return NextResponse.json({ received: true, duplicate: true });
      }

      const registrationCode = `SGVP-${Date.now()}`;
      const qrCodeDataUrl = await QRCode.toDataURL(registrationCode);

      const payload = {
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
        qr_code_data_url: qrCodeDataUrl,
      };

      console.log("Insert payload:", payload);

      const { data, error } = await supabaseAdmin
        .from("registrations")
        .insert(payload)
        .select();

      console.log("Insert data:", data);
      console.log("Insert error:", error);

      if (error) {
        return NextResponse.json({ received: false }, { status: 500 });
      }

      if (email) {
        try {
          const emailResult = await sendRegistrationEmail({
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

          console.log("Email sent successfully:", emailResult);
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
        }
      } else {
        console.warn("No email found in session metadata, skipping email send");
      }
    } catch (err) {
      console.error("Webhook processing crash:", err);
      return NextResponse.json({ received: false }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

export async function GET() {
  console.log("🔥 WEBHOOK GET HIT");
  return NextResponse.json({ route: "webhook alive" });
}