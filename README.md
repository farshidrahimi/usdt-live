# USDT Live

Mobile-first, installable USDT/IRT dashboard for **BitPin**, **Nobitex**, **Wallex**, and **Tabdeal**.

## Features

- Polls four exchange APIs every **2 seconds while the app is visible**.
- Displays per-exchange quotes, indicative average of available prices, errors, and last update time.
- Install from Safari: Share → **Add to Home Screen**.
- Static, dependency-free frontend, deployable with GitHub Pages.

## Deploy

1. Merge this PR.
2. Open **Settings → Pages** in this repository.
3. Under **Build and deployment → Source**, select **GitHub Actions**. The workflow in `.github/workflows/pages.yml` deploys automatically on pushes to `main`.
4. Visit https://farshidrahimi.github.io/usdt-live/ in Safari and choose **Add to Home Screen**.

## Browser CORS / optional Cloudflare Worker

Some exchange APIs block direct browser requests via CORS. Deploy `worker/worker.js` to a Cloudflare Worker if necessary and open:

```
https://farshidrahimi.github.io/usdt-live/?proxy=https://YOUR-WORKER.workers.dev
```

The optional proxy only accepts the four allowed exchange hosts. Do not expose an unrestricted CORS proxy. For an installed Home Screen PWA, configure the proxy as the default in `src/app.js`, because URL query parameters might not persist after installation.

## Price methodology

- **BitPin:** ticker last price.
- **Nobitex:** last trade price converted from IRR to IRT.
- **Wallex:** last trade price.
- **Tabdeal:** midpoint between best bid and best ask.

The average mixes last-trade and midpoint prices and is **indicative**, not an executable trading quote. Exchange APIs and response schemas can change; unavailable values display errors rather than fabricated prices.

## Limitations

GitHub Pages cannot bypass CORS. The browser polls only while the page is visible; iOS may suspend it in the background. This PWA is **not** a Dynamic Island Live Activity. Exchange integrations need validation against live API responses before production reliance.

## Deployment

GitHub Pages deployment is automated by `.github/workflows/pages.yml` on every push to `main`.

## Troubleshooting

Scriptable can fetch APIs that Safari blocks due to CORS. If Wallex or Tabdeal shows **Network / CORS blocked**, deploy the optional Cloudflare Worker in `worker/worker.js` and open the dashboard with `?proxy=https://YOUR-WORKER.workers.dev`. The proxy URL is remembered in browser storage; `?proxy=` clears it. Two-second polling is best effort and may be rate-limited.

## No-account public proxy fallback

When a **direct browser network request** to Wallex or Tabdeal fails, the dashboard automatically retries anonymous market data through `https://corsproxy.io/?url=`. No Cloudflare account or configuration is needed. Successful fallback cards display **public proxy**.

**Tradeoffs:** this third-party proxy can be blocked, unavailable, throttled, or serve incorrect/stale data. Do not use its results for trading decisions without independent verification. Only public market data is routed through it; no account credentials are sent by this application. A two-second polling cadence may exceed proxy or exchange rate limits. The public proxy is not controlled or guaranteed by this project.

<!-- Trigger GitHub Pages publish after public-proxy fallback merge. -->
