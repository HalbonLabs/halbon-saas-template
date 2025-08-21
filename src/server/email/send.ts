// src/server/email/send.ts
import { getProvider } from "@/config";

export async function sendWelcomeEmail(_to: string) {
  const email = getProvider("email");

  switch (email.provider) {
    case "resend": {
      // TODO: Implement Resend email integration
      // Import Resend from 'resend' and implement email sending
      return { ok: true, provider: "resend" } as const;
    }
    case "dummy":
    default:
      return { ok: true, provider: "dummy" } as const;
  }
}
