import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (token !== process.env.ADMIN_EXPORT_TOKEN) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return new NextResponse("Failed to fetch registrations", { status: 500 });
  }

  const headers = [
    "registration_code",
    "first_name",
    "last_name",
    "email",
    "phone",
    "attendee_count",
    "amount_total",
    "payment_status",
    "created_at"
  ];

  const rows = (data || []).map((r) =>
    [
      r.registration_code,
      r.first_name,
      r.last_name,
      r.email,
      r.phone,
      r.attendee_count,
      (r.amount_total / 100).toFixed(2),
      r.payment_status,
      r.created_at
    ]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="registrations.csv"'
    }
  });
}