# USDT Live

Mobile-first USDT/IRT dashboard for BitPin, Nobitex, Wallex, and Tabdeal.

## Deploy

1. Merge this pull request.
2. Open **Settings → Pages** and choose **Deploy from a branch** → **main** → **/ (root)**.
3. Open https://farshidrahimi.github.io/usdt-live/ in iPhone Safari, then tap **Share → Add to Home Screen**.

The app polls every 30 seconds **while visible** and displays available exchange prices, an indicative average, errors, and last checked time.

## CORS

Exchange APIs may block browser requests via CORS. An optional restricted Cloudflare Worker proxy is included in `worker/worker.js`. Deploy it as a Worker, then visit:

`https://farshidrahimi.github.io/usdt-live/?proxy=https://YOUR-WORKER.workers.dev`

To make a proxy permanent for a Home Screen installation, set the `proxy` default in `src/app.js` before installing; URL query parameters may not persist.

## Price sources

- BitPin: ticker price.
- Nobitex: last trade price converted from IRR to IRT.
- Wallex: last price.
- Tabdeal: midpoint of best bid and ask.

The average combines available values and is **not an executable trading quote**. API formats and units should be verified against current responses before relying on these prices.

GitHub Pages does not bypass CORS. iOS suspends background web apps; this is not a Dynamic Island Live Activity.
