import { NextResponse } from "next/server";
import { APP_URL, EVENT } from "@/lib/config";
import { calculateTotals, registrationSchema } from "@/lib/validation";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registrationSchema.safeParse({
      ...body,
      adults: Number(body.adults),
      extraShirts: Number(body.extraShirts),
      donationAmount: Number(body.donationAmount),
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid registration form." }, { status: 400 });
    }

    const input = parsed.data;
    const { shirtAmount, totalAmount } = calculateTotals(input);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/cancel`,
      customer_email: input.email,
      billing_address_collection: "auto",
      metadata: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        adults: String(input.adults),
        extraShirts: String(input.extraShirts),
        donationAmount: String(input.donationAmount),
        shirtAmount: String(shirtAmount),
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: input.donationAmount * 100,
            product_data: {
              name: `${EVENT.name} donation`,
              description: `Donation for ${input.adults} adult registration(s).`,
            },
          },
        },
        ...(shirtAmount > 0
          ? [
              {
                quantity: 1,
                price_data: {
                  currency: "usd",
                  unit_amount: shirtAmount * 100,
                  product_data: {
                    name: "Additional event t-shirts",
                    description: `${input.extraShirts} extra t-shirt(s).`,
                  },
                },
              },
            ]
          : []),
      ],
      payment_intent_data: {
        metadata: {
          registrationTotal: String(totalAmount),
        },
      },
      custom_text: {
        submit: {
          message: "After payment, you will receive a QR code confirmation email.",
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to create Stripe checkout session." }, { status: 500 });
  }
}
