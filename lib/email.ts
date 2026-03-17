import { Resend } from "resend";
import { EVENT } from "@/lib/config";

type ConfirmationEmailArgs = {
  to: string;
  fullName: string;
  registrationCode: string;
  adults: number;
  extraShirts: number;
  donationAmount: number;
  shirtAmount: number;
  totalAmount: number;
  qrDataUrl: string;
  receiptUrl?: string | null;
};

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(args: ConfirmationEmailArgs) {
  const from = process.env.FROM_EMAIL || "noreply@example.com";
  const receiptBlock = args.receiptUrl
    ? `<p style=\"margin:12px 0 0;\"><a href=\"${args.receiptUrl}\">View Stripe receipt</a></p>`
    : "";

  return resend.emails.send({
    from,
    to: args.to,
    subject: `${EVENT.name} registration confirmed`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:680px;margin:0 auto;color:#1f2937;line-height:1.5;">
        <h1 style="color:#c2410c;">You're registered for ${EVENT.name}</h1>
        <p>Hi ${args.fullName},</p>
        <p>Thank you for registering. Your payment was received successfully.</p>
        <div style="border:1px solid #fed7aa;border-radius:12px;padding:16px;background:#fff7ed;">
          <p><strong>Registration code:</strong> ${args.registrationCode}</p>
          <p><strong>Event date:</strong> ${EVENT.date}</p>
          <p><strong>Location:</strong> ${EVENT.location}</p>
          <p><strong>Adults registered:</strong> ${args.adults}</p>
          <p><strong>Extra t-shirts:</strong> ${args.extraShirts}</p>
          <p><strong>Donation:</strong> $${args.donationAmount}</p>
          <p><strong>Extra shirt amount:</strong> $${args.shirtAmount}</p>
          <p><strong>Total paid:</strong> $${args.totalAmount}</p>
          ${receiptBlock}
        </div>
        <h2 style="margin-top:24px;">QR confirmation</h2>
        <p>Please show this QR code at event check-in.</p>
        <img src="${args.qrDataUrl}" alt="QR Code" style="width:220px;height:220px;border:1px solid #e5e7eb;border-radius:12px;padding:10px;background:white;" />
        <p style="margin-top:24px;">We look forward to seeing you on ${EVENT.date}.</p>
        <p>SGVP Gurukul USA</p>
      </div>
    `,
  });
}
