"use server";

import { getPayloadClient } from "@/lib/cms/payload";

type ContactInput = { name: string; email: string; message: string };

/** Deliberately loose: one @, something either side, a dot in the domain. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Public contact form sink. Validation is repeated here rather than trusted
 * from the client, and every failure path returns `{ok:false}` — a thrown
 * server action would surface as an opaque error digest to the visitor.
 *
 * The message body is never logged: it is personal data.
 */
export async function submitContact(input: ContactInput): Promise<{ ok: boolean }> {
  try {
    const name = String(input?.name ?? "").trim();
    const email = String(input?.email ?? "").trim();
    const message = String(input?.message ?? "").trim();

    if (!name || !email || !message) {
      console.warn("Contact submission rejected: missing field");
      return { ok: false };
    }

    if (!EMAIL_RE.test(email)) {
      console.warn("Contact submission rejected: invalid email");
      return { ok: false };
    }

    const payload = await getPayloadClient();

    await payload.create({
      collection: "contact-submissions",
      data: { name, email, message },
    });

    return { ok: true };
  } catch (error) {
    // Reason only — never the submitted content.
    console.error(
      "Contact submission failed:",
      error instanceof Error ? error.message : "unknown error"
    );
    return { ok: false };
  }
}
