import { Resend } from "resend";

function isEmail(s) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }

  const { name, email, message } = body ?? {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing name, email, or message." });
  }
  if (!isEmail(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.RESEND_TO;
  if (!apiKey || !from || !to) {
    return res.status(500).json({
      error:
        "Server is not configured. Set RESEND_API_KEY, RESEND_FROM, and RESEND_TO in Vercel environment variables.",
    });
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}\n`,
    });
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Failed to send email." });
  }
}

