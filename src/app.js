import { parseBitpin, parseNobitex, parseWallex, parseTabdeal } from "./parsers.js";

const REFRESH_MS = 2000;
const TIMEOUT_MS = 12000;
const config = {
  bitpin: { url: "https://api.bitpin.ir/api/v1/mkt/tickers/", parse: parseBitpin },
  nobitex: { url: "https://apiv2.nobitex.ir/v3/orderbook/USDTIRT", parse: parseNobitex },
  wallex: { url: "https://api.wallex.ir/v1/markets", parse: parseWallex },
  tabdeal: { url: "https://api1.tabdeal.org/r/api/v1/depth?symbol=USDTIRT&limit=5", parse: parseTabdeal }
};
const fmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
if (params.has("proxy")) localStorage.setItem("usdtProxy", params.get("proxy") || "");
const proxy = localStorage.getItem("usdtProxy") || "";
const proxyURL = url => proxy ? proxy.replace(/\/$/, "") + "/?url=" + encodeURIComponent(url) : url;
let inFlight = false;
let nextTimer;

async function loadOne(name, {url, parse}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(proxyURL(url), {
      cache: "no-store", signal: controller.signal, headers: {Accept: "application/json"}
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const price = parse(await response.json());
    if (!Number.isFinite(price) || price <= 0) throw new Error("Price unavailable");
    return {name, price};
  } catch (error) {
    const message = error.name === "AbortError" ? "Timed out" : error.message;
    console.warn(name + " price fetch failed:", message);
    return {name, error: message};
  } finally {
    clearTimeout(timeout);
  }
}
async function refresh() {
  if (inFlight || document.hidden) return;
  clearTimeout(nextTimer);
  inFlight = true;
  $("refresh").disabled = true;
  $("status-text").textContent = "Updating";
  try {
    const results = await Promise.all(Object.entries(config).map(([name, item]) => loadOne(name, item)));
    const good = results.filter(item => Number.isFinite(item.price));
    for (const item of results) {
      const el = $(item.name);
      el.classList.toggle("error", !Number.isFinite(item.price));
      el.querySelector(".price").textContent = Number.isFinite(item.price) ? fmt.format(item.price) : "—";
      el.querySelector(".detail").textContent = Number.isFinite(item.price) ? "IRT / USDT" : item.error || "Unavailable";
    }
    $("average").textContent = good.length ? fmt.format(good.reduce((sum, x) => sum + x.price, 0) / good.length) : "—";
    $("average-detail").textContent = good.length ? good.length + " of 4 exchanges reporting" : "No exchange data available";
    $("updated").textContent = "Checked " + new Date().toLocaleTimeString();
    $("status").classList.toggle("ok", good.length > 0);
    $("status-text").textContent = good.length === 4 ? "Live" : good.length ? "Partial data" : "Unavailable";
  } finally {
    inFlight = false;
    $("refresh").disabled = false;
    if (!document.hidden) nextTimer = setTimeout(refresh, REFRESH_MS);
  }
}
$("refresh").addEventListener("click", () => { clearTimeout(nextTimer); refresh(); });
document.addEventListener("visibilitychange", () => {
  clearTimeout(nextTimer);
  if (!document.hidden) refresh();
});
refresh();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
