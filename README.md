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

## Deploy the CORS workaround automatically

The repository includes a Cloudflare Worker and a GitHub Actions workflow at `.github/workflows/deploy-proxy.yml`.

1. Create a Cloudflare account and obtain your **Account ID**.
2. Create a Cloudflare API token with **Workers Scripts: Edit** permission scoped to your account.
3. Add two repository Actions secrets at **Settings → Secrets and variables → Actions**:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
4. Merge the proxy PR. The workflow will deploy on the next change to `worker/**`, or run **Deploy Cloudflare price proxy** manually in GitHub Actions.
5. Find your deployed `https://usdt-live-proxy.<your-subdomain>.workers.dev` address in the workflow logs or Cloudflare dashboard.
6. Open the PWA once using `https://farshidrahimi.github.io/usdt-live/?proxy=https://usdt-live-proxy.<your-subdomain>.workers.dev`. The proxy setting is saved locally on that browser/device. Use `?proxy=` to clear it.

This server-side proxy avoids browser CORS restrictions; it does not bypass exchange API rate limits or geographic restrictions. A 2-second interval is best effort and may be throttled.
