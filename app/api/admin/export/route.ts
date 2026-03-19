import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    const expectedToken = process.env.ADMIN_EXPORT_TOKEN;

    if (!expectedToken) {
      return new NextResponse("Missing ADMIN_EXPORT_TOKEN", { status: 500 });
    }

    if (token !== expectedToken) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Export fetch error:", error);
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
      "stripe_checkout_session_id",
      "created_at",
    ];

    const rows = (data || []).map((r) =>
      [
        r.registration_code ?? "",
        r.first_name ?? "",
        r.last_name ?? "",
        r.email ?? "",
        r.phone ?? "",
        r.attendee_count ?? "",
        ((r.amount_total ?? 0) / 100).toFixed(2),
        r.payment_status ?? "",
        r.stripe_checkout_session_id ?? "",
        r.created_at ?? "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="registrations.csv"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Export route crash:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}