import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiError } from "@/lib/auth/guard";
import { created } from "@/lib/api/respond";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(40).nullish(),
  subject: z.string().max(80).nullish(),
  message: z.string().min(5).max(3000),
});

const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "comfyclub.pk@gmail.com";

/**
 * POST /api/contact — public contact form.
 * Stores the message (service role) and emails a notification via Resend when
 * RESEND_API_KEY is configured. Submission succeeds even if email is not set up.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const d = parsed.data;

  const db = createAdminClient();
  const { error } = await db.from("contact_submissions").insert({
    name: d.name, email: d.email, phone: d.phone ?? null, subject: d.subject ?? null, message: d.message,
  });
  if (error) return apiError(500, "INTERNAL_ERROR", error.message);

  // Best-effort email notification (no SDK; Resend REST API).
  const key = process.env.RESEND_API_KEY;
  if (key) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "ComfyClub <onboarding@resend.dev>",
          to: [CONTACT_EMAIL],
          reply_to: d.email,
          subject: `New enquiry: ${d.subject || "Contact form"} — ${d.name}`,
          html: `<h2>New contact form submission</h2>
<p><strong>Name:</strong> ${esc(d.name)}</p>
<p><strong>Email:</strong> ${esc(d.email)}</p>
<p><strong>Phone:</strong> ${esc(d.phone ?? "—")}</p>
<p><strong>Subject:</strong> ${esc(d.subject ?? "—")}</p>
<p><strong>Message:</strong></p><p>${esc(d.message).replace(/\n/g, "<br/>")}</p>`,
        }),
      });
    } catch {
      // ignore — message is already stored
    }
  }

  return created({ message: "Thanks! We'll get back to you within 24 hours." });
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
