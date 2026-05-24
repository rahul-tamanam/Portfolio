import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: "200kb" }));

const publicDir = __dirname;
app.use(express.static(publicDir));

function isEmail(s) {
  return typeof s === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.RESEND_FROM?.trim() ||
    "Portfolio <onboarding@resend.dev>";
  const to =
    process.env.RESEND_TO?.trim() ||
    process.env.AUTHOR_EMAIL?.trim();
  return { apiKey, from, to };
}

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body ?? {};

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
        "Server is not configured. Set RESEND_API_KEY and RESEND_TO (or AUTHOR_EMAIL) in .env.",
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
        error: error.message || "Failed to send email.",
      });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error("Contact send failed:", e);
    return res.status(500).json({
      error: e?.message || "Failed to send email.",
    });
  }
});

// SPA-ish fallback (keeps direct loads working)
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${port}`);
});

