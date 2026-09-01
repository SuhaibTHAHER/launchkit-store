export type ContactPayload = {
  name: string;
  email: string;
  reason: string;
  message: string;
};

/**
 * Stub submit handler — replace the body with a real request once a backend
 * exists, e.g.:
 *   const res = await fetch("/api/contact", { method: "POST", body: JSON.stringify(payload) });
 *   if (!res.ok) throw new Error("Failed to send message");
 * The form component only depends on this function resolving or throwing,
 * so swapping the implementation doesn't require touching the UI.
 */
export async function submitContactForm(payload: ContactPayload): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  console.info("Contact form submitted (no backend connected yet):", payload);
}
