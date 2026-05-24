const DEFAULT_FROM = "onboarding@resend.dev";
const PLACEHOLDER_DOMAINS = ["yourdomain.com", "example.com", "yoursite.com"];

function extractEmailAddress(from) {
  const match = from.match(/<([^>]+)>/);
  return (match ? match[1] : from).trim().toLowerCase();
}

export function resolveFromAddress() {
  const raw = process.env.RESEND_FROM?.trim();
  if (!raw) return DEFAULT_FROM;

  const email = extractEmailAddress(raw);
  if (PLACEHOLDER_DOMAINS.some((d) => email.endsWith(`@${d}`))) {
    console.warn(
      `RESEND_FROM uses placeholder domain "${email}" — using ${DEFAULT_FROM} instead.`,
    );
    return DEFAULT_FROM;
  }
  if (email.endsWith("@resend.dev")) return DEFAULT_FROM;
  return raw;
}

export function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = resolveFromAddress();
  const to =
    process.env.RESEND_TO?.trim() ||
    process.env.AUTHOR_EMAIL?.trim();
  return { apiKey, from, to };
}

export function formatResendError(message) {
  if (/domain.*not verified|verify your domain/i.test(message || "")) {
    return (
      "The sender domain is not verified in Resend. " +
      "Set RESEND_FROM to onboarding@resend.dev for now, " +
      "or add and verify your domain at resend.com/domains."
    );
  }
  return message || "Failed to send email.";
}
