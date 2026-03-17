import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="page">
      <div className="success-wrap">
        <div className="card success-card">
          <h1>Payment canceled</h1>
          <p>Your registration was not completed. You can return and try again.</p>
          <Link className="link-btn" href="/">Return to registration</Link>
        </div>
      </div>
    </main>
  );
}
