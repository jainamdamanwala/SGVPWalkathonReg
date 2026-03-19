import { Resend } from "resend";

type SendRegistrationEmailParams = {
  to: string;
  firstName: string;
  lastName: string;
  attendeeCount: number;
  donationAmount: number;
  extraShirts: number;
  totalAmount: number;
  registrationCode: string;
  qrCodeDataUrl: string;
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  return new Resend(apiKey);
}

export async function sendRegistrationEmail({
  to,
  firstName,
  lastName,
  attendeeCount,
  donationAmount,
  extraShirts,
  totalAmount,
  registrationCode,
  qrCodeDataUrl,
}: SendRegistrationEmailParams) {
  const from = process.env.EMAIL_FROM;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!from) {
    throw new Error("Missing EMAIL_FROM");
  }

  const resend = getResendClient();

  const html = `
    <div style="font-family: Arial, sans-serif; color: #2C1810; line-height: 1.6;">
      <div style="text-align:center; padding: 20px 0;">
        ${appUrl ? `<img src="${appUrl}/head.png" alt="SGVP Gurukul USA" style="height: 100px;" />` : ""}
        <h2 style="margin: 10px 0 0;">Registration Confirmed</h2>
        <p style="margin: 6px 0;">SGVP Gurukul USA Walk-A-Thon 2026</p>
      </div>

      <p>Dear ${firstName} ${lastName},</p>

      <p>Thank you for registering for the SGVP Gurukul USA Walk-A-Thon supporting First Responders.</p>

      <div style="background:#FFF3E8; padding:16px; border-radius:10px; border:1px solid #FFE0C4;">
        <p><strong>Registration Code:</strong> ${registrationCode}</p>
        <p><strong>Adults Registered:</strong> ${attendeeCount}</p>
        <p><strong>Extra T-Shirts:</strong> ${extraShirts}</p>
        <p><strong>Donation:</strong> $${Number(donationAmount).toFixed(2)}</p>
        <p><strong>Total Paid:</strong> $${(Number(totalAmount) / 100).toFixed(2)}</p>
        <p><strong>Date:</strong> April 5, 2026</p>
        <p><strong>Location:</strong> 2006 Fort Argyle Rd, Bloomingdale, GA 31302</p>
      </div>

      <div style="text-align:center; margin: 24px 0;">
        <p><strong>Your QR Code</strong></p>
        <img src="${qrCodeDataUrl}" alt="QR Code" style="width:220px; height:220px;" />
      </div>

      <p>Please keep this email for event check-in.</p>

      <p>Thank you,<br />SGVP Gurukul USA</p>
    </div>
  `;

  const result = await resend.emails.send({
    from,
    to,
    subject: "Your SGVP Walk-A-Thon Registration Confirmation",
    html,
  });

  console.log("Resend response:", result);

  if ((result as any)?.error) {
    throw new Error(JSON.stringify((result as any).error));
  }

  return result;
}