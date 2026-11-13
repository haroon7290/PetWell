# Pet Well – online pet shop

A copy of the Pet Well Shopify store built with **Next.js** and **Payload CMS**, with **Stripe** for payments and hosted on **Vercel**. There is no Shopify in it: products, orders and content are managed in an easy admin panel at `/admin`.

| What | Where |
| --- | --- |
| Website | `/` |
| Admin panel (products, orders, homepage) | `/admin` |
| Database | Postgres (Neon, via the Vercel Marketplace) |
| Photos & prescription files | Vercel Blob |
| Payments | Stripe Checkout (cards, Apple Pay, Google Pay, discount codes) |

---

## 1. Deploy to Vercel (one-off, about 15 minutes)

1. **Import the repo** – go to [vercel.com/new](https://vercel.com/new), pick `haroon7290/PetWell` and click **Deploy**. The first build will fail because there is no database yet – that's expected.
2. **Add a database** – in the Vercel project open **Storage → Create → Neon (Postgres)** and connect it to the project. This sets `DATABASE_URL` for you.
3. **Add photo storage** – **Storage → Create → Blob**, connect it to the project. This sets `BLOB_READ_WRITE_TOKEN`.
4. **Add the remaining settings** – **Settings → Environment Variables**:
   - `PAYLOAD_SECRET` – any long random string (e.g. run `openssl rand -hex 32`)
   - `NEXT_PUBLIC_SERVER_URL` – your site address, e.g. `https://petwell.vercel.app` (no trailing slash)
   - `STRIPE_SECRET_KEY` – from Stripe → Developers → API keys (start with the `sk_test_…` key)
   - `STRIPE_WEBHOOK_SECRET` – see step 6
5. **Redeploy** – Deployments → ⋯ → Redeploy. The build creates the database tables automatically.
6. **Connect Stripe** – in Stripe → Developers → Webhooks → **Add endpoint**:
   - URL: `https://YOUR-SITE/next/stripe-webhook`
   - Events: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`
   - Copy the **Signing secret** (`whsec_…`) into `STRIPE_WEBHOOK_SECRET` and redeploy.
7. **Create the admin login** – open `https://YOUR-SITE/admin` and create the first account.
8. **Import the shop** – on the admin dashboard click **Import starter content**. This copies all 10 products, the homepage, photos, articles and pages from the Shopify store (do this while the Shopify store is still online, so the photos can be downloaded).
9. **Discount code** – the banner advertises `PETWELL10`. Create it in Stripe → Product catalogue → Coupons (10% off) → add a promotion code `PETWELL10`.

To go live, swap the Stripe test keys for live keys (and create a live webhook), then add your domain in Vercel → Settings → Domains.

---

## 2. Guide for the shop owner

Sign in at **yoursite.com/admin**. The dashboard shows what needs attention: orders to pack, prescriptions to check, new messages and low stock.

### Add or edit a product
1. **Products → Create new** (or click **+ Add a product** on the dashboard).
2. **1. Basics** – name, brand, photos (drag them in; the first one is the main photo), short description, key benefits and extra sections such as *Feeding guide*.
3. **2. Prices & sizes** – one row per size/option with its price. Fill in **Was price** to show it on sale. Fill in **Stock** if you want stock tracked (it goes down automatically when orders are paid); leave it empty if not.
4. **3. Labels & rules** – optional badge (e.g. *Bestseller*), and tick *Prescription required* for prescription medicines.
5. On the right choose **Categories** (Dog, Cat, …) and press **Save**. The product is live straight away. Choose *Hidden (draft)* to hide it.

### Handle an order
1. Paid orders appear under **Orders** automatically (and on the dashboard).
2. Open the order to see items, customer and delivery address.
3. Change **Status** to *Packing*, then *Shipped* and add the tracking number. Press **Save**.
4. Orders with prescription items arrive as *On hold*. Check the prescription under **Prescriptions**, mark it *Approved*, then continue as normal.
5. Refunds are done in Stripe (search for the payment ID shown in the order's **Payment** tab). The order is marked *Refunded* automatically.

Customers can check their order at **/order-status** with their order number and email.

### Change the homepage, banners and delivery prices
- **Homepage** – slideshow, tiles, offers, banners and which products appear in each row.
- **Store settings** – logo, the three top banners (including the countdown), the trust strip, delivery prices, free-delivery threshold, countries you deliver to (UK/US), contact details and footer links.
- **Pet care hub articles** and **Pages** – blog posts and information pages (Help centre, Prescriptions, Rewards…).

### Other inboxes
- **Contact messages** – messages from the Contact page.
- **Newsletter sign-ups** – emails from the sign-up forms (use *Export* to download them).

---

## 3. For developers

```bash
cp .env.example .env      # fill in DATABASE_URL and PAYLOAD_SECRET at least
npm install
npm run payload migrate   # create tables
npm run dev               # http://localhost:3000 and /admin
```

- Schema changes: edit `src/collections/*` or `src/globals/*`, then `npm run migrate:create -- my-change` and commit the new file in `src/migrations`. Vercel runs `payload migrate` before every build.
- After changing admin components run `npm run generate:importmap`; after schema changes run `npm run generate:types`.
- Checkout: `src/app/(frontend)/next/checkout/route.ts` creates a Stripe Checkout session; `src/lib/orders.ts` turns a paid session into an order (called by the webhook and the thank-you page, safe to run twice).
- Styling: `src/app/(frontend)/globals.css` uses the original Shopify theme's colours and fonts (Poppins + Open Sans).
