// src/server/email/send.ts
import { getProvider } from "@/config";

export async function sendWelcomeEmail(to: string) {
  const email = getProvider("email");

  switch (email.provider) {
    case "resend": {
      // const resend = new Resend(email.apiKey!);
      // await resend.emails.send({ from: email.fromDefault!, to, subject: "...", html: "..." });
      return { ok: true, provider: "resend" } as const;
    }
    case "dummy":
    default:
      return { ok: true, provider: "dummy" } as const;
  }
}
