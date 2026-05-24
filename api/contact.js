import { Resend } from "resend";
import { getResendConfig, formatResendError } from "../lib/resend-config.js";

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

  const { apiKey, from, to } = getResendConfig();
  if (!apiKey || !to) {
    return res.status(500).json({
      error:
        "Server is not configured. Set RESEND_API_KEY and RESEND_TO (or AUTHOR_EMAIL) in Vercel environment variables.",
    });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}\n`,
    });
    if (error) {
      console.error("Resend API error:", error);
      return res.status(500).json({
        error: formatResendError(error.message),
      });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error("Contact send failed:", e);
    return res.status(500).json({
      error: formatResendError(e?.message),
    });
  }
}

