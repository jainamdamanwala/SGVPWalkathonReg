"use client";

import { useMemo, useState } from "react";

const PER_PERSON = 20;
const SHIRT_PRICE = 10;

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [adults, setAdults] = useState(1);
  const [extraShirts, setExtraShirts] = useState(0);
  const [donationAmount, setDonationAmount] = useState(20);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const minimumDonation = adults * PER_PERSON;
  const shirtAmount = extraShirts * SHIRT_PRICE;
  const totalAmount = donationAmount + shirtAmount;

  useMemo(() => {
    if (donationAmount < minimumDonation) {
      setDonationAmount(minimumDonation);
    }
  }, [minimumDonation, donationAmount]);

  async function handleCheckout() {
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          adults,
          extraShirts,
          donationAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not create checkout session.");
      }

      window.location.href = data.url;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <section className="card form-card">
      <div className="section-title">Participant information</div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="firstName">First name</label>
          <input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="lastName">Last name</label>
          <input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="email">Email address</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="phone">Phone number</label>
        <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="adults">Number of adult attendees</label>
        <select
          id="adults"
          value={adults}
          onChange={(e) => setAdults(Number(e.target.value))}
        >
          {Array.from({ length: 25 }, (_, i) => i + 1).map((count) => (
            <option key={count} value={count}>{count}</option>
          ))}
        </select>
        <div className="inline-help">Every registered adult receives an event t-shirt.</div>
      </div>

      <div className="field">
        <label>Additional t-shirts for kids or extra family members</label>
        <div className="counter">
          <button type="button" onClick={() => setExtraShirts((v) => Math.max(0, v - 1))}>−</button>
          <div className="counter-value">{extraShirts}</div>
          <button type="button" onClick={() => setExtraShirts((v) => v + 1)}>+</button>
          <div className="inline-help">${SHIRT_PRICE} each</div>
        </div>
      </div>

      <div className="section-title" style={{ marginTop: 24 }}>Donation</div>
      <div className="notice orange">
        Minimum donation is ${minimumDonation} for {adults} adult{adults === 1 ? "" : "s"}. 100% of proceeds support first responders.
      </div>
      <div className="field">
        <label htmlFor="donationAmount">Donation amount</label>
        <input
          id="donationAmount"
          className="range"
          type="range"
          min={minimumDonation}
          max={minimumDonation + 500}
          step={5}
          value={donationAmount}
          onChange={(e) => setDonationAmount(Number(e.target.value))}
        />
        <div className="summary-row"><span>Selected donation</span><strong>${donationAmount}</strong></div>
      </div>

      <div className="notice">
        After payment, the attendee receives a confirmation email with a QR code, registration details, and receipt link.
      </div>

      <div className="summary-list">
        <div className="summary-row"><span>Adults</span><strong>{adults}</strong></div>
        <div className="summary-row"><span>Extra shirts</span><strong>{extraShirts}</strong></div>
        <div className="summary-row"><span>Extra shirt total</span><strong>${shirtAmount}</strong></div>
        <div className="summary-row"><span>Donation</span><strong>${donationAmount}</strong></div>
      </div>
      <div className="summary-total">
        <strong>Total</strong>
        <strong>${totalAmount}</strong>
      </div>

      <button className="submit" disabled={submitting} onClick={handleCheckout}>
        {submitting ? "Redirecting to secure payment..." : "Register and pay"}
      </button>
      {status ? <div className="status">{status}</div> : null}
    </section>
  );
}
