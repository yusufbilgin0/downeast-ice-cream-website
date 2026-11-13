/**
 * Contact and wholesale inquiries.
 *
 * Emails go out through Resend's HTTP API when these environment variables
 * are set (see README):
 *   RESEND_API_KEY   - API key from resend.com
 *   INQUIRY_TO       - inbox that receives inquiries
 *   INQUIRY_FROM     - verified sender, e.g. "Website <web@downeasticecreamfactory.com>"
 * Without them the endpoint answers 503 and the form asks visitors to call.
 */

const MAX = { name: 100, email: 200, phone: 40, business: 150, message: 4000 };

function clean(v: unknown, max: number) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  // Honeypot field: real visitors never see or fill it.
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const kind = body.kind === "wholesale" ? "wholesale" : "contact";
  const data = {
    name: clean(body.name, MAX.name),
    email: clean(body.email, MAX.email),
    phone: clean(body.phone, MAX.phone),
    business: clean(body.business, MAX.business),
    message: clean(body.message, MAX.message),
  };

  const errors: Record<string, string> = {};
  if (!data.name) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please enter a valid email address.";
  if (!data.message) errors.message = "Please enter a message.";
  if (kind === "wholesale" && !data.business) errors.business = "Please enter your business name.";
  if (Object.keys(errors).length) return Response.json({ error: "validation", errors }, { status: 422 });

  const { RESEND_API_KEY, INQUIRY_TO, INQUIRY_FROM } = process.env;
  if (!RESEND_API_KEY || !INQUIRY_TO || !INQUIRY_FROM) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const subject = kind === "wholesale" ? `Wholesale inquiry: ${data.business}` : `Website message from ${data.name}`;
  const rows = Object.entries(data)
    .filter(([, v]) => v)
    .map(([k, v]) => `<p><strong>${k}</strong><br>${escapeHtml(v).replace(/\n/g, "<br>")}</p>`)
    .join("");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: INQUIRY_FROM, to: [INQUIRY_TO], reply_to: data.email, subject, html: rows }),
  });

  if (!res.ok) return Response.json({ error: "send_failed" }, { status: 502 });
  return Response.json({ ok: true });
}
