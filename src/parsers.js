// Exchange response schemas can change; invalid/missing values must never be shown as zero.
const positive = (v) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : null; };
export function parseBitpin(data) {
  const root = data?.results ?? data?.data ?? data?.tickers ?? data;
  const keys = ["USDT_IRT", "USDTIRT", "USDTTMN", "USDT_TMN"];
  let item;
  if (Array.isArray(root)) item = root.find(x => keys.includes(String(x.symbol ?? x.market ?? x.name ?? "").toUpperCase()));
  else if (root && typeof root === "object") item = keys.map(k => root[k]).find(Boolean);
  return positive(item?.price ?? item?.last_price ?? item?.lastPrice ?? item?.latest_price ?? item?.close);
}
export function parseNobitex(data) {
  if (data?.status && data.status !== "ok") return null;
  // Nobitex USDTIRT orderbook values are commonly expressed in IRR.
  return positive(data?.lastTradePrice) / 10 || null;
}
export function parseWallex(data) {
  const symbols = data?.result?.symbols ?? data?.symbols;
  const item = Array.isArray(symbols) ? symbols.find(x => ["USDTTMN", "USDTIRT"].includes(x.symbol)) : (symbols?.USDTTMN ?? symbols?.USDTIRT);
  return positive(item?.stats?.lastPrice ?? item?.lastPrice);
}
export function parseTabdeal(data) {
  const bids = data?.bids ?? data?.result?.bids;
  const asks = data?.asks ?? data?.result?.asks;
  const bid = positive(bids?.[0]?.[0]);
  const ask = positive(asks?.[0]?.[0]);
  return bid && ask ? (bid + ask) / 2 : null;
}
