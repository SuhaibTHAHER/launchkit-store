# Launchkit Store

The Launchkit sales site: bilingual (English/Arabic, with full RTL) home page, `/products` listing, per-product detail pages, `/license`, user accounts, Paddle checkout, and an `/admin` panel — for the products in the `launchkit_products` Supabase table (Launchkit AI, Launchkit Dashboard, Launchkit UI, Launchkit Complete).

## Requirements

- Node.js 20.9 or later
- A Supabase project (for accounts) — see below

## Installation

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`. Two things are optional until you're ready for them:

- Without the Supabase env vars, sign-up/sign-in will error — accounts won't work, but the rest of the site does.
- Without the Paddle env vars, every "Buy" button shows *"Checkout isn't configured yet"* instead of opening checkout.

## Languages (English / Arabic)

Routing and translations are handled by [next-intl](https://next-intl.dev). English is the default (no URL prefix, e.g. `/products`); Arabic is served under `/ar` (e.g. `/ar/products`) with the page automatically switched to `dir="rtl"` and the Cairo Arabic typeface.

- All UI copy (nav, footer, buttons, form labels, static pages) lives in `src/messages/en.json` and `src/messages/ar.json` — same keys in both files.
- Content that comes from data, not UI chrome (product names/descriptions, blog posts, the general FAQ), is bilingual right in its data file in `src/lib/` — e.g. `products.ts` stores `name: { en: "...", ar: "..." }` instead of a plain string.
- Add a language by adding its locale to `src/i18n/routing.ts` and a matching `src/messages/<locale>.json`.

## Accounts (Supabase Auth)

Sign-up, sign-in, and the `/account` page (profile + order history) are backed by a real Supabase project — not a mock.

1. **Get your project URL and anon/publishable key.** Supabase Dashboard → Project Settings → API. Put them in `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. **Run the schema.** The tables this site needs (`launchkit_profiles`, `launchkit_orders`, `launchkit_wishlist`, `launchkit_product_ownership`, `launchkit_products` — all namespaced with a `launchkit_` prefix so they never collide with anything else in the same project) are defined in the migrations applied when this was set up — see your Supabase project's migration history, which is authoritative; `docs/schema.sql` is a rough starting point for a fresh project, not a full mirror. Row Level Security is on throughout: a user can only read/update their own rows, except `launchkit_products` (public read) and the admin-only cross-user policies described below.
3. That's it for sign-up/sign-in/profile editing — they work immediately once the two env vars above are set.

**Billing is intentionally not a card form.** The Billing section on `/account` never collects or stores a card number — that's a real security liability (PCI compliance) this template deliberately avoids. Once Paddle is connected (see below), "Manage payment method" should link to the customer's Paddle-hosted portal, where Paddle — not this app — holds the card data. `launchkit_orders` is ready to be filled by a Paddle webhook on successful checkout; that webhook isn't wired up yet.

## Connecting real checkout (Paddle)

This site does **not** create Paddle products for you — Paddle products, prices, and your account's identity/business verification only happen inside your own Paddle dashboard, which nothing here has access to. Three things to do there before checkout will work:

1. **Get your client-side token.** Paddle Dashboard → Developer Tools → Authentication → create a client-side token. Put it in `.env.local` as `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`.
2. **Create one Price per product.** Paddle Dashboard → Catalog → Products → New Product, once for each product. Each product needs at least one Price; copy its Price ID (starts with `pri_`).
3. **Paste each Price ID into the matching product's "Paddle price ID" field in `/admin/products`** (see Admin, below) — products live in the database now, not in a source file.

Leave `NEXT_PUBLIC_PADDLE_ENV=sandbox` while testing — Paddle's sandbox lets you run a full checkout with fake cards. Switch it to `production` only once your Paddle account is fully approved and you're ready to take real payments.

## Project structure

```text
launchkit-store/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx                 # Home
│   │   │   ├── products/page.tsx        # Product grid (search/filter/sort)
│   │   │   ├── products/[slug]/page.tsx # Product detail + checkout
│   │   │   ├── login/, signup/, account/
│   │   │   ├── blog/, docs/, about/, faq/, contact/
│   │   │   └── license/, privacy/, terms/
│   │   ├── sitemap.ts, robots.ts, icon.svg   # Locale-independent, stay at true root
│   │   └── layout.tsx
│   ├── i18n/            # next-intl routing, navigation helpers, request config
│   ├── messages/         # en.json / ar.json — all UI copy
│   ├── components/
│   │   ├── navbar.tsx, footer.tsx, locale-switcher.tsx
│   │   ├── auth/         # sign-in/up forms, profile form, sign-out button
│   │   ├── product-card.tsx, product-browser.tsx, product-preview.tsx
│   │   ├── checkout-button.tsx     # Paddle.js integration
│   │   └── faq.tsx
│   └── lib/
│       ├── products.ts, categories.ts, blog.ts, faq.ts  # Bilingual content
│       ├── supabase/     # browser/server/middleware clients
│       └── actions/auth.ts   # Server Actions: sign up, sign in, sign out, update profile
├── src/middleware.ts     # Combines locale routing + Supabase session refresh
├── .env.local.example
└── README.md
```

## Admin panel

`/admin` is a real admin area, gated by an `is_admin` flag on `launchkit_profiles` (not by anything client-side — the database enforces it via RLS policies keyed on a `launchkit_is_admin()` SQL function, so a bug in the app layer can't grant broader access than the DB allows). It has three sections:

- **Overview** (`/admin`) — revenue (split into real vs. demo, since demo checkouts don't move money until Paddle is connected), order counts, registered users, top products.
- **Products** (`/admin/products`) — create, edit, and publish/unpublish templates. Structured fields for the everyday stuff (name, price, category, featured/published, etc.); the deeper nested content (gallery, features, changelog, FAQ, etc.) is edited as raw JSON in labeled textareas, with per-field validation so one typo doesn't block saving the rest. An edit here shows up on the public product page on the very next request — no redeploy.
- **Orders** (`/admin/orders`) and **Users** (`/admin/users`) — read-only order history across every customer, and a list of every account with a grant/revoke-admin toggle.

**No extra env var is required** — the admin panel reads and writes through the normal Supabase session client, gated by RLS, not a service-role key.

**Granting the first admin:** there's no self-serve "become admin" flow (by design — see the RLS lockdown note in `docs/schema.sql`). Sign up for a normal account first, then flip the flag directly in Supabase:

```sql
update public.launchkit_profiles set is_admin = true where email = 'you@example.com';
```

Once you're an admin, you can grant/revoke it for other accounts from `/admin/users` — an admin can never remove their own access (a lockout guard enforced by the `launchkit_set_admin()` function, not just the UI).

## Editing product content

Product data lives in the `launchkit_products` Supabase table, not in a source file — edit it from `/admin/products` (see above). `src/lib/products.ts` only holds the `Product` TypeScript type and the read functions (`getProducts`, `getProduct`, etc.) that the storefront pages call.

## Deployment

```bash
npm run build
npm start
```

Set all the env vars from `.env.local.example` on your host (Vercel, Netlify, etc.) — they're read at build/runtime, not baked into the repo.
