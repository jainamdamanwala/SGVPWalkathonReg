import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

type SearchParams = Promise<{ token?: string }>;

function formatCurrency(cents: number | null | undefined) {
  return `$${((cents || 0) / 100).toFixed(2)}`;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export default async function AdminPage(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const token = searchParams?.token;
  const expectedToken = process.env.ADMIN_DASHBOARD_TOKEN;

  if (!expectedToken || token !== expectedToken) {
    redirect("/");
  }

  const { data, error } = await supabaseAdmin
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#FFFCF7",
          color: "#2C1810",
          fontFamily: "Poppins, sans-serif",
          padding: "40px 20px",
        }}
      >
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem" }}>
          Admin Dashboard
        </h1>
        <p style={{ color: "#B00020", marginTop: "16px" }}>
          Failed to load registrations.
        </p>
        <pre
          style={{
            marginTop: "16px",
            background: "#fff",
            padding: "16px",
            borderRadius: "12px",
            overflowX: "auto",
          }}
        >
          {JSON.stringify(error, null, 2)}
        </pre>
      </main>
    );
  }

  const registrations = data || [];

  const totalRegistrations = registrations.length;
  const totalAdults = registrations.reduce(
    (sum, r) => sum + Number(r.attendee_count || 0),
    0
  );
  const totalRaised = registrations.reduce(
    (sum, r) => sum + Number(r.amount_total || 0),
    0
  );
  const paidCount = registrations.filter(
    (r) => String(r.payment_status || "").toLowerCase() === "paid"
  ).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FFFCF7",
        color: "#2C1810",
        fontFamily: "Poppins, sans-serif",
        position: "relative",
      }}
    >
      <div
        style={{
          height: "6px",
          background:
            "linear-gradient(90deg, #E91E8C 0%, #FF6B00 30%, #F5A623 60%, #4CAF50 80%, #E91E8C 100%)",
        }}
      />

      <section
        style={{
          padding: "36px 20px 24px",
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
            width: "120px",
            height: "120px",
            objectFit: "contain",
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
          SGVP Gurukul USA · Admin
        </div>
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 800,
            margin: "10px 0 8px",
          }}
        >
          Walk-A-Thon <em style={{ color: "#FF6B00", fontStyle: "italic" }}>Dashboard</em>
        </h1>
        <p style={{ color: "#5C4033" }}>
          Live registrations, totals, and export access
        </p>
      </section>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 16px 48px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Total Registrations", value: totalRegistrations, color: "#FF6B00" },
            { label: "Adults Registered", value: totalAdults, color: "#E91E8C" },
            { label: "Paid Registrations", value: paidCount, color: "#2E7D32" },
            { label: "Total Raised", value: formatCurrency(totalRaised), color: "#1565C0" },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "#fff",
                border: "1.5px solid rgba(255,107,0,0.18)",
                borderRadius: "18px",
                padding: "20px",
                boxShadow: "0 4px 24px rgba(255,107,0,0.07)",
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#8C7B6B",
                  marginBottom: "8px",
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: item.color,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <a
            href={`/api/admin/export?token=${encodeURIComponent(process.env.ADMIN_DASHBOARD_TOKEN || "")}`}
            style={{
              display: "inline-block",
              padding: "14px 22px",
              background: "linear-gradient(135deg, #FF6B00 0%, #D44E00 100%)",
              color: "#fff",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 700,
              boxShadow: "0 6px 20px rgba(255,107,0,0.25)",
            }}
          >
            Download CSV
          </a>

          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "14px 22px",
              background: "#fff",
              color: "#5C4033",
              border: "1.5px solid rgba(255,107,0,0.32)",
              borderRadius: "12px",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Back to Registration
          </Link>
        </div>

        <div
          style={{
            background: "#fff",
            border: "1.5px solid rgba(255,107,0,0.18)",
            borderRadius: "20px",
            boxShadow: "0 4px 24px rgba(255,107,0,0.07)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "18px 20px",
              borderBottom: "1px solid #FFE0C4",
              fontWeight: 700,
              color: "#FF6B00",
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontSize: "0.78rem",
            }}
          >
            Registration List
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "1100px",
              }}
            >
              <thead>
                <tr style={{ background: "#FFF8F2" }}>
                  {[
                    "Name",
                    "Email",
                    "Phone",
                    "Adults",
                    "Amount",
                    "Status",
                    "Registration Code",
                    "Stripe Session",
                    "Created At",
                  ].map((heading) => (
                    <th
                      key={heading}
                      style={{
                        textAlign: "left",
                        padding: "14px 16px",
                        fontSize: "0.78rem",
                        color: "#8C7B6B",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        borderBottom: "1px solid #FFE0C4",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {registrations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      style={{
                        padding: "24px 16px",
                        textAlign: "center",
                        color: "#8C7B6B",
                      }}
                    >
                      No registrations found yet.
                    </td>
                  </tr>
                ) : (
                  registrations.map((r) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #FFF1E3" }}>
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <strong>
                          {r.first_name} {r.last_name}
                        </strong>
                      </td>
                      <td style={{ padding: "14px 16px" }}>{r.email || "—"}</td>
                      <td style={{ padding: "14px 16px" }}>{r.phone || "—"}</td>
                      <td style={{ padding: "14px 16px" }}>
                        {r.attendee_count ?? 0}
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 700 }}>
                        {formatCurrency(r.amount_total)}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 10px",
                            borderRadius: "999px",
                            background:
                              String(r.payment_status).toLowerCase() === "paid"
                                ? "#E8F5E9"
                                : "#FFF3E0",
                            color:
                              String(r.payment_status).toLowerCase() === "paid"
                                ? "#2E7D32"
                                : "#E65100",
                            fontWeight: 700,
                            fontSize: "0.8rem",
                          }}
                        >
                          {r.payment_status || "—"}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        {r.registration_code || "—"}
                      </td>
                      <td style={{ padding: "14px 16px", maxWidth: "220px" }}>
                        <div
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                          title={r.stripe_checkout_session_id || ""}
                        >
                          {r.stripe_checkout_session_id || "—"}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        {formatDate(r.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}