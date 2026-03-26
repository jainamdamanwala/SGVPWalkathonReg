import Link from "next/link";

export default function SuccessPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FFFCF7",
        color: "#2C1810",
        fontFamily: "Poppins, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Watermark */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.04,
          backgroundImage: "url('/SGVPLogoUSA.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
          transform: "rotate(-10deg) scale(1.15)",
        }}
      />

      {/* Top gradient bar */}
      <div
        style={{
          height: "6px",
          background:
            "linear-gradient(90deg, #E91E8C 0%, #FF6B00 30%, #F5A623 60%, #4CAF50 80%, #E91E8C 100%)",
          position: "relative",
          zIndex: 2,
        }}
      />

      {/* Hero */}
      <section
        style={{
          position: "relative",
          zIndex: 2,
          padding: "40px 20px 24px",
          textAlign: "center",
          background:
            "linear-gradient(160deg, rgba(255,248,240,0.97) 0%, rgba(255,243,228,0.97) 60%, rgba(254,232,204,0.97) 100%)",
          borderBottom: "2px solid #FFE0C4",
        }}
      >
        <img
          src="/head.png"
          alt="SGVP Gurukul USA"
          style={{
            width: "140px",
            height: "140px",
            objectFit: "contain",
            filter:
              "drop-shadow(0 6px 20px rgba(233,30,140,0.2)) drop-shadow(0 2px 8px rgba(255,107,0,0.15))",
          }}
        />

        <div
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "3px",
            color: "#E91E8C",
            textTransform: "uppercase",
            marginTop: "14px",
          }}
        >
          SGVP Gurukul USA · Shree Dharmajivan Mission Trust
        </div>

        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(2rem, 6vw, 3.2rem)",
            fontWeight: 800,
            margin: "10px 0 8px",
            lineHeight: 1.08,
          }}
        >
          Registration <em style={{ color: "#4CAF50", fontStyle: "italic" }}>Successful</em>
        </h1>

        <p
          style={{
            fontSize: "0.95rem",
            color: "#5C4033",
            fontWeight: 500,
            maxWidth: "720px",
            margin: "0 auto",
          }}
        >
          Thank you for supporting our community and first responders. Your
          registration has been confirmed!
        </p>
      </section>

      {/* Divider */}
      <div
        style={{
          height: "18px",
          background:
            "linear-gradient(90deg,#E91E8C 0%,#E91E8C 14.28%,#FF6B00 14.28%,#FF6B00 28.56%,#F5A623 28.56%,#F5A623 42.84%,#4CAF50 42.84%,#4CAF50 57.12%,#1565C0 57.12%,#1565C0 71.4%,#9C27B0 71.4%,#9C27B0 85.68%,#E91E8C 85.68%,#E91E8C 100%)",
          opacity: 0.3,
          position: "relative",
          zIndex: 2,
        }}
      />

      {/* Content */}
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "28px 18px 60px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.96)",
            border: "1.5px solid rgba(255,107,0,0.18)",
            borderRadius: "22px",
            padding: "34px 28px",
            boxShadow:
              "0 4px 24px rgba(255,107,0,0.07), 0 1px 4px rgba(0,0,0,0.04)",
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "86px",
              height: "86px",
              margin: "0 auto 18px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #E8F5E9, #C8E6C9)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2.2rem",
            }}
          >
            ✅
          </div>

          <h2
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.9rem",
              fontWeight: 800,
              marginBottom: "10px",
            }}
          >
            You're Registered!
          </h2>

          <p
            style={{
              color: "#5C4033",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              maxWidth: "560px",
              margin: "0 auto 22px",
            }}
          >
            Your payment has been successfully processed. A confirmation email
            with your QR code and registration details has been sent to you.
          </p>

          {/* Info box */}
          <div
            style={{
              background: "#F0FFF4",
              border: "1.5px solid rgba(76,175,80,0.3)",
              borderRadius: "14px",
              padding: "18px 16px",
              marginBottom: "24px",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "2px",
                color: "#2E7D32",
                textTransform: "uppercase",
                marginBottom: "10px",
              }}
            >
              What happens next
            </div>

            <div style={{ color: "#5C4033", fontSize: "0.92rem", lineHeight: 1.7 }}>
              • Check your email for confirmation and QR code<br />
              • Bring your QR code on event day for check-in<br />
              • Each registered participant will receive a t-shirt<br />
              • Join us on <strong>April 5, 2026</strong> at SGVP Gurukul USA
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "15px 28px",
                background: "linear-gradient(135deg, #FF6B00 0%, #D44E00 100%)",
                color: "#FFFFFF",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 700,
                boxShadow: "0 6px 20px rgba(255,107,0,0.35)",
              }}
            >
              Go to Home
            </Link>

            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "15px 28px",
                background: "#FFFFFF",
                color: "#5C4033",
                border: "1.5px solid rgba(255,107,0,0.32)",
                borderRadius: "12px",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Register Another
            </Link>
          </div>

          <p
            style={{
              marginTop: "18px",
              fontSize: "0.78rem",
              color: "#8C7B6B",
            }}
          >
            🔒 Secure payment powered by Stripe
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: "28px",
            color: "#8C7B6B",
            fontSize: "0.8rem",
            lineHeight: 1.7,
          }}
        >
          <img
            src="/SGVPLogoUSA.png"
            alt="SGVP Gurukul USA"
            style={{ height: "46px", width: "auto", marginBottom: "10px", opacity: 0.35 }}
          />
          <div>
            SGVP Gurukul USA · 2006 Fort Argyle Rd, Bloomingdale, GA 31302
            <br />
            Walk-A-Thon 2026 · April 5, 2026 · Supporting First Responders
          </div>
        </div>
      </div>
    </main>
  );
}
