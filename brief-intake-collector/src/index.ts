// Brief-intake collector — Cloudflare Worker that receives the contact
// form on gatewaytechaeo.com, validates the payload, generates a markdown
// summary, and emails it via the CF Email Routing send_email binding.
//
// docs: https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/

import { EmailMessage } from "cloudflare:email";

interface Env {
  BRIEF_MAILER: { send(msg: EmailMessage): Promise<void> };
}

const REQUIRED_FIELDS = [
  "name",
  "email",
  "location",
  "business_one_liner",
  "current_goals",
] as const;

const OPTIONAL_FIELDS = ["site_url", "message", "service"] as const;
const ALL_FIELDS = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS] as const;

const FROM_NAME = "Gateway Tech AEO Brief Intake";
const FROM_ADDRESS = "forms@gatewaytechaeo.com";
const TO_ADDRESS = "jamison.matthew@icloud.com";
const THANKS_URL = "https://intake.gatewaytechaeo.com/thanks";
const SITE_HOME = "https://gatewaytechaeo.com/";

const MAX_FIELD_BYTES = 8192;
const MAX_TOTAL_BYTES = 32768;
const SUBJECT_LIMIT = 78;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Brief {
  name: string;
  email: string;
  location: string;
  business_one_liner: string;
  current_goals: string;
  site_url?: string;
  message?: string;
  service?: string;
}

function detectMode(ct: string): "form" | "json" | null {
  const lc = ct.toLowerCase();
  if (lc.startsWith("application/x-www-form-urlencoded")) return "form";
  if (lc.startsWith("application/json")) return "json";
  return null;
}

function clamp(s: string, max = MAX_FIELD_BYTES): string {
  return s.length > max ? s.slice(0, max) : s;
}

function escapeMarkdown(s: string): string {
  // Defang markdown control chars so submitter input cannot inject formatting.
  return s
    .replace(/\\/g, "\\\\")
    .replace(/([`*_{}\[\]()#+\-.!|>])/g, "\\$1");
}

function parseAndValidate(
  data: Record<string, string>
): { ok: true; brief: Brief } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  for (const f of REQUIRED_FIELDS) {
    if (!data[f] || data[f].trim().length === 0) {
      errors.push(`${f}: required`);
    }
  }
  if (data.email && !EMAIL_RE.test(data.email)) {
    errors.push("email: invalid format");
  }
  const totalBytes = Object.values(data).reduce(
    (acc, v) => acc + (v?.length ?? 0),
    0
  );
  if (totalBytes > MAX_TOTAL_BYTES) {
    errors.push(`payload: exceeds ${MAX_TOTAL_BYTES} bytes`);
  }
  if (errors.length) return { ok: false, errors };

  const brief: Brief = {
    name: clamp(data.name.trim()),
    email: clamp(data.email.trim()),
    location: clamp(data.location.trim()),
    business_one_liner: clamp(data.business_one_liner.trim()),
    current_goals: clamp(data.current_goals.trim()),
  };
  if (data.site_url) brief.site_url = clamp(data.site_url.trim());
  if (data.message) brief.message = clamp(data.message.trim());
  if (data.service) brief.service = clamp(data.service.trim(), 64);
  return { ok: true, brief };
}

function renderMarkdown(brief: Brief, cfRay: string): string {
  const e = escapeMarkdown;
  const now = new Date().toISOString();
  const lines: string[] = [];
  lines.push("# New brief");
  lines.push("");
  lines.push(`**From:** ${e(brief.name)} <${e(brief.email)}>`);
  lines.push(`**Business:** ${e(brief.business_one_liner)}`);
  lines.push(`**Location:** ${e(brief.location)}`);
  if (brief.site_url) lines.push(`**Site:** ${e(brief.site_url)}`);
  if (brief.service) lines.push(`**Tier requested:** ${e(brief.service)}`);
  lines.push("");
  lines.push("## Current goals");
  lines.push("");
  lines.push(e(brief.current_goals));
  if (brief.message) {
    lines.push("");
    lines.push("## Additional message");
    lines.push("");
    lines.push(e(brief.message));
  }
  lines.push("");
  lines.push("---");
  lines.push(`_Received ${now} · cf-ray ${e(cfRay)}_`);
  lines.push("_Reply directly — Reply-To is set to the submitter's email._");
  return lines.join("\n");
}

function buildSubject(brief: Brief): string {
  const raw = `New brief - ${brief.name} - ${brief.business_one_liner}`;
  return raw.length > SUBJECT_LIMIT ? raw.slice(0, SUBJECT_LIMIT - 3) + "..." : raw;
}

// Strip CR/LF + other control chars from header values to prevent header injection.
function sanitizeHeaderValue(s: string): string {
  return s.replace(/[\r\n\x00-\x1f]/g, " ").trim();
}

// Build an RFC 5322 message. text/plain UTF-8 body. CRLF line endings.
// Body is quoted-printable safe for typical markdown; we use 8bit transfer
// encoding which Cloudflare's MTA accepts and re-encodes if needed.
function buildRawMime(args: {
  fromName: string;
  fromAddress: string;
  toAddress: string;
  replyTo: string;
  subject: string;
  body: string;
  cfRay: string;
}): string {
  const messageId = `<${crypto.randomUUID()}@gatewaytechaeo.com>`;
  const date = new Date().toUTCString();
  const headers: string[] = [
    `From: "${sanitizeHeaderValue(args.fromName)}" <${sanitizeHeaderValue(args.fromAddress)}>`,
    `To: <${sanitizeHeaderValue(args.toAddress)}>`,
    `Reply-To: <${sanitizeHeaderValue(args.replyTo)}>`,
    `Subject: ${sanitizeHeaderValue(args.subject)}`,
    `Date: ${date}`,
    `Message-ID: ${messageId}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 8bit`,
    `X-CF-Ray: ${sanitizeHeaderValue(args.cfRay)}`,
  ];
  // RFC 5322 requires CRLF between every line.
  return headers.join("\r\n") + "\r\n\r\n" + args.body.replace(/\r?\n/g, "\r\n");
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// Inline thanks page. The Worker serves this directly so we don't depend on
// a Hugo page rendering. Tokens mirror critical-inline.css on the main site.
function renderThanksHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Brief received — Gateway Tech AEO</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<style>
  :root {
    --bone: #f4efe7;
    --ink: #14110f;
    --stone: #6b665d;
    --brick: #ad4527;
  }
  html, body { margin: 0; padding: 0; background: var(--bone); color: var(--ink); }
  body { font-family: Georgia, "Times New Roman", serif; line-height: 1.6; }
  main { max-width: 640px; margin: 0 auto; padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 4vw, 1.5rem); }
  h1 { font-size: clamp(2rem, 5vw, 2.75rem); font-weight: 400; margin: 0 0 1rem; letter-spacing: -0.02em; }
  p { font-size: 1.125rem; color: var(--ink); margin: 0 0 1.25rem; }
  p.lede { font-style: italic; color: var(--stone); }
  strong { color: var(--ink); }
  a { color: var(--brick); text-decoration: none; border-bottom: 1px solid var(--brick); }
  a:hover, a:focus { background: var(--brick); color: var(--bone); outline: none; }
  .back { margin-top: 3rem; font-size: 0.9375rem; }
</style>
</head>
<body>
<main>
  <h1>Brief received.</h1>
  <p class="lede">Your brief landed in Matthew's inbox.</p>
  <p>Every brief gets read personally. Expect a reply from <strong>jamison.matthew@icloud.com</strong> within <strong>48&ndash;96 hours</strong> on US business days. The first reply will reference specific details from what you sent &mdash; if it reads generic, it isn't from Matthew.</p>
  <p>If 96 hours pass without a reply, check your spam folder for that address, then send a one-line nudge with &ldquo;brief follow-up&rdquo; in the subject.</p>
  <p class="back"><a href="${SITE_HOME}">&larr; Back to the site</a></p>
</main>
</body>
</html>
`;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    const cfRay = req.headers.get("cf-ray") ?? "local";

    if (req.method === "GET") {
      // /thanks is the post-submission landing page (303 target from POST).
      if (url.pathname === "/thanks") {
        return new Response(renderThanksHtml(), {
          status: 200,
          headers: {
            "content-type": "text/html; charset=utf-8",
            "x-robots-tag": "noindex",
          },
        });
      }
      return new Response(
        "Brief-intake endpoint. POST application/x-www-form-urlencoded or application/json to /brief.\n",
        { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } }
      );
    }

    if (req.method !== "POST") {
      return new Response(null, {
        status: 405,
        headers: { Allow: "GET, POST" },
      });
    }

    if (url.pathname !== "/brief") {
      return new Response(null, { status: 404 });
    }

    const ct = req.headers.get("content-type") ?? "";
    const mode = detectMode(ct);
    if (!mode) {
      return new Response(null, { status: 415 });
    }

    const data: Record<string, string> = {};
    try {
      if (mode === "form") {
        const params = new URLSearchParams(await req.text());
        for (const [k, v] of params) data[k] = v;
      } else {
        const json = (await req.json()) as Record<string, unknown>;
        for (const [k, v] of Object.entries(json)) {
          if (typeof v === "string") data[k] = v;
        }
      }
    } catch {
      return jsonResponse(400, { errors: ["body: parse error"] });
    }

    const result = parseAndValidate(data);
    if (!result.ok) {
      return jsonResponse(400, { errors: result.errors });
    }
    const { brief } = result;

    const raw = buildRawMime({
      fromName: FROM_NAME,
      fromAddress: FROM_ADDRESS,
      toAddress: TO_ADDRESS,
      replyTo: brief.email,
      subject: buildSubject(brief),
      body: renderMarkdown(brief, cfRay),
      cfRay,
    });

    try {
      const emailMessage = new EmailMessage(FROM_ADDRESS, TO_ADDRESS, raw);
      await env.BRIEF_MAILER.send(emailMessage);
    } catch (err) {
      console.log("send_email_failed", JSON.stringify({
        cf_ray: cfRay,
        error: (err as Error).message ?? String(err),
      }));
      return jsonResponse(502, {
        errors: ["delivery: upstream mail send failed"],
      });
    }

    console.log("brief_received", JSON.stringify({
      cf_ray: cfRay,
      from: brief.email,
      name: brief.name,
      service: brief.service ?? null,
    }));

    const accept = req.headers.get("accept") ?? "";
    if (accept.includes("application/json")) {
      return jsonResponse(200, { ok: true });
    }
    return Response.redirect(THANKS_URL, 303);
  },
};
