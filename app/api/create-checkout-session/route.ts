import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const REGISTRATION_FEE_PER_PERSON = 20;
const EXTRA_SHIRT_PRICE = 10;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const firstName = String(body.firstName || "").trim();
    const lastName = String(body.lastName || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();

    const attendeeCount = Number(body.attendeeCount || 1);
    const extraShirts = Number(body.extraShirts || 0);
    const extraDonation = Number(body.extraDonation || 0);

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(attendeeCount) || attendeeCount < 1) {
      return NextResponse.json(
        { error: "Attendee count must be at least 1." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(extraShirts) || extraShirts < 0) {
      return NextResponse.json(
        { error: "Extra shirts cannot be negative." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(extraDonation) || extraDonation < 0) {
      return NextResponse.json(
        { error: "Extra donation cannot be negative." },
        { status: 400 }
      );
    }

    const registrationTotal = attendeeCount * REGISTRATION_FEE_PER_PERSON;
    const shirtsTotal = extraShirts * EXTRA_SHIRT_PRICE;
    const totalAmountDollars =
      registrationTotal + extraDonation + shirtsTotal;

    const totalAmountCents = Math.round(totalAmountDollars * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      automatic_tax: { enabled: false },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "SGVP Gurukul USA Walk-A-Thon Registration",
              description: `${attendeeCount} adult(s), ${extraShirts} extra shirt(s), $${extraDonation} extra donation`,
            },
            unit_amount: totalAmountCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        firstName,
        lastName,
        email,
        phone,
        attendeeCount: String(attendeeCount),
        extraShirts: String(extraShirts),
        extraDonation: String(extraDonation),
        registrationTotal: String(registrationTotal),
        shirtsTotal: String(shirtsTotal),
        totalAmountDollars: String(totalAmountDollars),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Create checkout session error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}