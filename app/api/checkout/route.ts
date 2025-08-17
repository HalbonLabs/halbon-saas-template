// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { getProvider } from "@/config";

export async function POST() {
  const payments = getProvider("payments");

  switch (payments.provider) {
    case "stripe": {
      // Example – construct client using centralized config
      // const stripe = new Stripe(payments.apiKey!, { apiVersion: payments.apiVersion as any });
      // const session = await stripe.checkout.sessions.create({ ... });
      // return NextResponse.json({ id: session.id });
      return NextResponse.json({ ok: true, provider: "stripe" });
    }
    case "dummy":
    default:
      // No-op / mock
      return NextResponse.json({ ok: true, provider: "dummy" });
  }
}
