// Based on the working Scriptable price extraction logic.
function num(value) {
  if (value === null || value === undefined || value === "") throw new Error("Missing price");
  const n = Number(String(value).replace(/,/g, ""));
  if (!Number.isFinite(n) || n <= 0) throw new Error("Invalid price: " + value);
  return n;
}
export function parseBitpin(data) {
  const containers = [data, data?.results, data?.data, data?.result, data?.tickers, data?.data?.results];
  const symbols = ["USDT_IRT", "USDTIRT", "USDT_TMN", "USDTTMN"];
  const priceOf = item => num(item.price ?? item.last_price ?? item.lastPrice ?? item.latest_price ?? item.close);
  for (const container of containers) {
    if (Array.isArray(container)) {
      const ticker = container.find(item => symbols.includes(String(item.symbol ?? item.market ?? item.code ?? item.name ?? "").toUpperCase()));
      if (ticker) return priceOf(ticker);
    } else if (container && typeof container === "object") {
      for (const symbol of symbols) if (container[symbol]) return priceOf(container[symbol]);
    }
  }
  throw new Error("BitPin USDT ticker not found");
}
export function parseNobitex(data) {
  if (data?.status !== "ok") throw new Error("Nobitex API error");
  return num(data.lastTradePrice) / 10;
}
export function parseWallex(data) {
  const symbols = data?.result?.symbols;
  const market = Array.isArray(symbols) ? symbols.find(x => x.symbol === "USDTTMN") : symbols?.USDTTMN;
  if (!market) throw new Error("Wallex market missing");
  return num(market.stats?.lastPrice ?? market.stats?.last_price ?? market.lastPrice);
}
export function parseTabdeal(data) {
  if (!Array.isArray(data?.bids) || !Array.isArray(data?.asks) || !data.bids.length || !data.asks.length) {
    throw new Error("Tabdeal orderbook unavailable");
  }
  return (num(data.bids[0][0]) + num(data.asks[0][0])) / 2;
}
