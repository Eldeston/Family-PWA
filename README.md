# Olive (placeholder name): family digital wellbeing PWA

A prototype where parents and teens agree on digital habits together.
All data stays in the browser (localStorage). No tracking, no accounts, no server data.

## Run
- Quick: open `public/index.html` in a browser (service worker needs http, so use the line below for the full PWA).
- Full PWA: `npm install`, `npm start`, open http://localhost:3000
- Phone view: Chrome F12, then the device toolbar.

## Features
Parent/Teen switch, shared rules both sides agree to, daily habits, self-reported screen time,
conversation cards, daily check-in reminder, teen requests with parent replies,
olive tree that grows with kept agreements, mood check-in with activity suggestions and family sharing, settings.

## Branding checklist
- App name: `APP` at the top of `public/app.js`, plus `<title>` in `index.html` and `name` in `manifest.json`
- Colours: CSS variables at the top of `public/style.css`, plus `theme_color` and `background_color` in `manifest.json`
- Logo: replace `public/icons/icon-192.png` and `icon-512.png`
- Tree art: replace the `tree()` SVG function in `public/app.js`
- Rewrite the sample questions (`Q`) and mood activities (`ACT`) in your own words
- After editing files, bump `CACHE` in `public/sw.js` so phones pick up the update

## Install on a phone / APK
Host the `public/` contents over HTTPS (GitHub Pages or Netlify Drop also work), open the link on a phone and choose Add to Home screen.
For an APK, paste the hosted link into pwabuilder.com, then Package for stores, then Android.

## AI use declaration
Tool: Claude. Purpose: code and planning. Touched: all app code (HTML, CSS, JS, service worker, manifest), Express server, README, feature-list wording, plain placeholder icons.
