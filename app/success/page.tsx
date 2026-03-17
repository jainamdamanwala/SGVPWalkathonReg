import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="page">
      <div className="success-wrap">
        <div className="card success-card">
          <h1>Payment received</h1>
          <p>
            Thank you for registering. A confirmation email with your QR code and payment details
            will arrive shortly.
          </p>
          <p>
            If you do not see the email, check spam or promotions and make sure the payment was completed.
          </p>
          <Link className="link-btn" href="/">Back to registration page</Link>
        </div>
      </div>
    </main>
  );
}
