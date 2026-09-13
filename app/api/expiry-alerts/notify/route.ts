import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { medicineId } = await request.json();
    if (!medicineId) {
      return NextResponse.json(
        { error: "Medicine ID is required" },
        { status: 400 },
      );
    }
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return NextResponse.json(
        { error: "Supabase credentials not configured" },
        { status: 503 },
      );
    }
    const supabase = createServerSupabaseClient();
    const { data: medicine, error } = await supabase
      .from("medicines")
      .select(
        "id, name, expiry_date, batch_number, suppliers (id, name, email, contact_number)",
      )
      .eq("id", medicineId)
      .single();
    if (error || !medicine) {
      return NextResponse.json(
        { error: "Failed to fetch medicine details" },
        { status: 500 },
      );
    }
    const suppliers = medicine.suppliers;
    if (!suppliers?.length) {
      return NextResponse.json(
        { error: "No supplier is linked to this medicine" },
        { status: 422 },
      );
    }
    // Record every related supplier. Recording is not proof of email/SMS delivery.
    const { error: notificationError } = await supabase
      .from("notifications")
      .insert(
        suppliers.map((supplier) => ({
          type: "expiry_alert",
          recipient_type: "supplier",
          recipient_id: supplier.id,
          content: `Notification about medicine "${medicine.name}" (Batch: ${medicine.batch_number}) approaching expiry date of ${medicine.expiry_date}`,
          status: "pending",
          created_at: new Date().toISOString(),
        })),
      );
    if (notificationError) {
      return NextResponse.json(
        { error: "Failed to record expiry notifications" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      {
        message:
          "Expiry notifications recorded. Email/SMS delivery is not configured.",
        status: "pending",
        details: {
          medicine: medicine.name,
          batch: medicine.batch_number,
          suppliers,
        },
      },
      { status: 202 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof SyntaxError
            ? "Invalid JSON request"
            : "Internal server error",
      },
      { status: error instanceof SyntaxError ? 400 : 500 },
    );
  }
}
