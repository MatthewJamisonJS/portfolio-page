export default {
  async fetch(req: Request): Promise<Response> {
    // Only accept POST; GET returns a stub so the URL doesn't 404
    // for accidental browser hits.
    if (req.method === "GET") {
      return new Response("CSP violation report endpoint. POST CSP reports here.", {
        status: 200,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    if (req.method !== "POST") {
      return new Response(null, { status: 405, headers: { Allow: "GET, POST" } });
    }

    const ct = req.headers.get("content-type") ?? "";
    const body = await req.text();
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

    // 204 No Content is the conventional ack for CSP report endpoints.
    return new Response(null, { status: 204 });
  },
};
