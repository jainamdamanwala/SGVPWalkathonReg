# SGVP Gurukul USA Walk-A-Thon Registration App

This is a production-ready starter for turning your registration page into a shareable registration link with:

- public registration page
- Stripe payment collection
- confirmation email after successful payment
- QR code in the confirmation email
- stored registration records in Supabase
- CSV export for admin reporting

## Stack

- Next.js App Router
- Stripe Checkout + Stripe Webhooks
- Supabase database
- Resend email API
- QRCode library

## 1. Install

```bash
npm install
```

## 2. Add environment variables

Copy `.env.example` to `.env.local` and fill in your real values.

## 3. Create the database table

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor.

## 4. Run locally

```bash
npm run dev
```

## 5. Stripe webhook for local testing

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Then copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.

## 6. Deploy

Deploy to Vercel and add the same environment variables in Vercel project settings.

## Registration flow

1. User fills the form.
2. App creates a Stripe Checkout session.
3. User pays securely on Stripe.
4. Stripe calls `/api/stripe/webhook`.
5. Webhook stores the registration in Supabase.
6. Webhook generates a unique QR code.
7. Confirmation email is sent through Resend.
8. Admin can export registrations as CSV.

## Export registered people

Open this URL in your browser after deployment:

```text
https://your-domain.com/api/admin/export?token=YOUR_ADMIN_EXPORT_TOKEN
```

That downloads a CSV file that opens in Excel.

## Notes

- The backend recalculates totals and minimum donation rules.
- Stripe can also send its own receipt emails if enabled in your Stripe dashboard.
- You should connect a verified sender domain in Resend for reliable email delivery.
- Add your event logo in `public/` and update the page UI if you want branding closer to your original HTML.

## Suggested next upgrades

- admin dashboard with login
- QR code scanner check-in page
- coupon codes / sponsor codes
- optional child attendee field
- shirt size collection per attendee
