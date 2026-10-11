// Optional Cloudflare Worker CORS proxy. Set this worker URL as ?proxy=https://YOUR-WORKER.workers.dev
const ALLOWED = new Set(["api.bitpin.ir", "apiv2.nobitex.ir", "api.wallex.ir", "api1.tabdeal.org"]);
export default {
  async fetch(request) {
    const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
    if (request.method === "OPTIONS") return new Response(null, {status: 204, headers: cors});
    if (request.method !== "GET") return new Response("Method not allowed", {status: 405, headers: cors});
    let url;
    try { url = new URL(new URL(request.url).searchParams.get("url")); } catch { return new Response("Invalid URL", {status: 400, headers: cors}); }
    if (url.protocol !== "https:" || !ALLOWED.has(url.hostname) || url.port || url.username || url.password) return new Response("Host not allowed", {status: 403, headers: cors});
    try {
      const response = await fetch(url.toString(), {headers: {"Accept": "application/json"}, redirect: "error", signal: AbortSignal.timeout(9000)});
      return new Response(response.body, {status: response.status, headers: {...cors, "Content-Type": "application/json", "Cache-Control": "no-store"}});
    } catch { return new Response(JSON.stringify({error:"Upstream unavailable"}), {status: 502, headers: {...cors, "Content-Type": "application/json"}}); }
  }
};
