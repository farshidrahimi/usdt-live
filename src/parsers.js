// Validate exchange values without silently treating missing prices as zero.
function num(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(String(value).replace(/,/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}
export function parseBitpin(data) {
  const containers = [data, data?.results, data?.data, data?.result, data?.tickers, data?.data?.results];
  const symbols = ["USDT_IRT", "USDTIRT", "USDT_TMN", "USDTTMN"];
  for (const container of containers) {
    let item;
    if (Array.isArray(container)) {
      item = container.find(x => symbols.includes(String(x?.symbol ?? x?.market ?? x?.code ?? x?.name ?? "").toUpperCase()));
    } else if (container && typeof container === "object") {
      item = symbols.map(symbol => container[symbol]).find(Boolean);
    }
    if (item) return num(item.price ?? item.last_price ?? item.lastPrice ?? item.latest_price ?? item.close);
  }
  return null;
}
export function parseNobitex(data) {
  if (data?.status !== "ok") return null;
  const price = num(data.lastTradePrice);
  return price === null ? null : price / 10;
}
export function parseWallex(data) {
  const symbols = data?.result?.symbols;
  const market = Array.isArray(symbols)
    ? symbols.find(x => x?.symbol === "USDTTMN")
    : symbols?.USDTTMN;
  if (!market) return null;
  return num(market.stats?.lastPrice ?? market.stats?.last_price ?? market.lastPrice);
}
export function parseTabdeal(data) {
  if (!Array.isArray(data?.bids) || !Array.isArray(data?.asks)) return null;
  const bid = num(data.bids[0]?.[0]);
  const ask = num(data.asks[0]?.[0]);
  return bid !== null && ask !== null ? (bid + ask) / 2 : null;
}
