import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token || token !== process.env.ADMIN_EXPORT_TOKEN) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("registrations")
    .select("registration_code,first_name,last_name,email,phone,adults,extra_shirts,donation_amount,shirt_amount,total_amount,payment_status,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Could not fetch registrations." }, { status: 500 });
  }

  const headers = [
    "registration_code",
    "first_name",
    "last_name",
    "email",
    "phone",
    "adults",
    "extra_shirts",
    "donation_amount",
    "shirt_amount",
    "total_amount",
    "payment_status",
    "created_at",
  ];

  const rows = [headers.join(",")].concat(
    (data || []).map((row) =>
      headers
        .map((key) => {
          const value = String((row as Record<string, unknown>)[key] ?? "").replace(/"/g, '""');
          return `"${value}"`;
        })
        .join(",")
    )
  );

  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="sgvp-registrations.csv"',
    },
  });
}
