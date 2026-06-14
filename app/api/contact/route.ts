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

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * POST /api/contact — public contact form.
 * Resilient: tries to store the message (service role) AND email a notification
 * (Resend). Succeeds if either path works, so a missing key/table never loses
 * the customer's message.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return apiError(400, "VALIDATION_ERROR", parsed.error.issues[0]?.message ?? "Invalid input");
  }
  const d = parsed.data;

  // 1) Store in the database (best-effort).
  let stored = false;
  try {
    const db = createAdminClient();
    const { error } = await db.from("contact_submissions").insert({
      name: d.name, email: d.email, phone: d.phone ?? null, subject: d.subject ?? null, message: d.message,
    });
    if (error) console.error("contact: db insert failed:", error.message);
    else stored = true;
  } catch (e) {
    console.error("contact: admin client unavailable:", e instanceof Error ? e.message : e);
  }

  // 2) Email a notification via Resend (best-effort).
  let emailed = false;
  const key = process.env.RESEND_API_KEY;
  if (key) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
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
      if (res.ok) emailed = true;
      else console.error("contact: resend failed:", res.status, await res.text().catch(() => ""));
    } catch (e) {
      console.error("contact: resend error:", e instanceof Error ? e.message : e);
    }
  }

  if (!stored && !emailed) {
    return apiError(500, "INTERNAL_ERROR", "We couldn't send your message right now. Please WhatsApp us instead.");
  }
  return created({ message: "Thanks! We'll get back to you within 24 hours." });
}
