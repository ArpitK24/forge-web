// Vercel serverless function: POST /api/waitlist  { email }
// Saves the signup to the Supabase table `waitlist`. Env vars come from the Vercel <> Supabase integration.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(500).json({ error: "Waitlist not configured" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const email = String((body && body.email) || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) return res.status(400).json({ error: "Invalid email" });

  const r = await fetch(`${url}/rest/v1/waitlist?on_conflict=email`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=ignore-duplicates,return=minimal",
    },
    body: JSON.stringify({
      email,
      source: String((body && body.source) || "").slice(0, 100) || null,
      user_agent: String(req.headers["user-agent"] || "").slice(0, 300) || null,
    }),
  });
  if (!r.ok) {
    console.error("supabase insert failed", r.status, await r.text());
    return res.status(502).json({ error: "Could not save" });
  }
  return res.status(200).json({ ok: true });
};
