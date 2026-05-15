export default {
  async fetch(req: Request): Promise<Response> {
    if (req.method === "GET") {
      return new Response("CSP violation report endpoint. POST CSP reports here.", {
        status: 200,
        headers: { "content-type": "text/plain; charset=utf-8", "x-robots-tag": "noindex" },
      });
    }
    if (req.method !== "POST") {
      return new Response(null, { status: 405, headers: { Allow: "GET, POST", "x-robots-tag": "noindex" } });
    }

    // Validate Content-Type: real CSP reports arrive as one of two MIME
    // types. Anything else is abuse / random POSTers and we 415 it to
    // keep the log clean. We still log the reject so unknown shapes are
    // visible during browser drift.
    const ct = (req.headers.get("content-type") ?? "").toLowerCase();
    const isLegacy = ct.startsWith("application/csp-report");
    const isModern = ct.startsWith("application/reports+json");
    if (!isLegacy && !isModern) {
      console.log("csp-report-reject", JSON.stringify({
        content_type: ct,
        user_agent: req.headers.get("user-agent"),
        cf_ray: req.headers.get("cf-ray"),
        cf_ipcountry: req.headers.get("cf-ipcountry"),
      }));
      return new Response(null, { status: 415, headers: { "x-robots-tag": "noindex" } });
    }

    const body = await req.text();
    // Truncate to 8192 UTF-16 code units. CSP reports are ASCII JSON in
    // practice so this is effectively 8192 bytes; for non-ASCII payloads
    // the cap is slightly higher in bytes. Boundary safety: JSON.stringify
    // re-escapes any lone surrogate as \uXXXX so the log entry stays valid.
    const truncated = body.slice(0, 8192);

    // console.log lands in Workers observability (queryable via the
    // cf-observability MCP later).
    console.log("csp-report", JSON.stringify({
      content_type: ct,
      user_agent: req.headers.get("user-agent"),
      cf_ray: req.headers.get("cf-ray"),
      cf_ipcountry: req.headers.get("cf-ipcountry"),
      body: truncated,
      truncated: body.length > 8192,
    }));

    return new Response(null, { status: 204, headers: { "x-robots-tag": "noindex" } });
  },
};
