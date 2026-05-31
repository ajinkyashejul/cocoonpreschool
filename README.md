# Cocoon Preschool & Daycare — Landing Page

A fast, mobile-first landing page built for Google Ads traffic. The main goal is
**lead capture**: parents request a callback (or call/WhatsApp instantly).

It's a static site (HTML/CSS/JS) — no build step — hosted free on **GitHub Pages**.

---

## 🚀 Going live (one-time setup)

### 1. Enable GitHub Pages
1. Push this branch (already done by Claude).
2. Go to the repo → **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) will deploy automatically
   on every push. Your site appears at:
   `https://<your-username>.github.io/cocoonpreschool/`

### 2. Connect your custom domain (after you buy it)
1. Repo → **Settings → Pages → Custom domain** → enter your domain (e.g. `cocoonpreschool.in`).
2. Create a file named **`CNAME`** in the repo root containing just your domain, e.g.:
   ```
   cocoonpreschool.in
   ```
3. At your domain registrar, add DNS records:
   - **A records** for the apex domain → GitHub Pages IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** for `www` → `<your-username>.github.io`
4. Back in Settings → Pages, tick **Enforce HTTPS** (after DNS propagates).

---

## ✏️ What to fill in (search the code for `EDIT:`)

| What | Where |
|------|-------|
| **Phone number** (call + WhatsApp) | `index.html` — replace `+910000000000` / `910000000000` everywhere; `script.js` → `WHATSAPP_NUMBER` |
| **Address, email, hours** | `index.html` footer + structured-data block |
| **Lead form email delivery** | See "Lead capture" below |
| **Photos** | Drop images into `/assets` (see naming below) |
| **Google Ads tracking** | `index.html` gtag block + `script.js` → `ADS_CONVERSION` |
| **Real reviews** | `index.html` testimonials section |

> Tip: Phone numbers appear in several places (header, hero, form, footer, CTA band,
> mobile call bar). Do a find-and-replace on `0000000000` to update them all at once.

---

## 📞 Lead capture (how parents reach you)

The form needs zero code to start working:

- **Before setup:** submitting the form opens **WhatsApp** with the parent's details
  pre-filled, plus the page has direct **Call** and **WhatsApp** buttons. Nothing is lost.
- **Recommended (so leads land in your inbox):** use a free form backend:
  1. Sign up at <https://formspree.io> (free tier is fine).
  2. Create a form; copy its endpoint (`https://formspree.io/f/abcwxyz`).
  3. In `index.html`, replace `YOUR_FORM_ID` in the form's `action`.
  4. Done — every submission is emailed to you, and the page shows a thank-you
     state without reloading.

**Anti-spam:** the form has a hidden honeypot field + only 3 short questions
(name, phone, child's age) to deter bots while staying frictionless for parents.

---

## 🖼️ Photos

Add JPGs to `/assets` with these names (they auto-appear; missing ones show a placeholder):

```
assets/gallery-1.jpg ... gallery-6.jpg   ← gallery tiles (≈ 800×600)
assets/og-image.jpg                       ← social share preview (1200×630)
```

Optimize photos (e.g. <https://squoosh.app>) so pages load fast on mobile data —
important for ad quality score and bounce rate.

---

## 📈 Google Ads tips

1. Add your conversion tracking: uncomment the `gtag` block in `index.html` (use your
   `AW-XXXXXXXXX` ID) and set `ADS_CONVERSION.send_to` in `script.js` to your
   conversion label. The form fires a `conversion` event on success.
2. Point ads at the live URL; the page is single-purpose (callback) for a high
   conversion rate.
3. Buttons/links emit `data-track` events you can use as secondary conversions
   (calls, WhatsApp clicks).

---

## Local preview

Just open `index.html` in a browser, or run a tiny server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
