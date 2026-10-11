# USDT Live

Mobile-first, installable USDT/IRT dashboard for **BitPin**, **Nobitex**, **Wallex**, and **Tabdeal**.

## Features

- Polls four exchange APIs every **30 seconds while the app is visible**.
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
