# Launchkit Store

The Launchkit sales site: bilingual (English/Arabic, with full RTL) home page, `/products` listing, per-product detail pages, `/license`, user accounts, and Paddle checkout — for the three products defined in `src/lib/products.ts` (Launchkit AI, Launchkit Dashboard, Launchkit Complete).

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
2. **Run the schema.** The two tables this site needs (`launchkit_profiles`, `launchkit_orders`, both namespaced with a `launchkit_` prefix so they never collide with anything else in the same project) are defined in the migration applied when this was set up — see your Supabase project's migration history, or re-create them from `docs/schema.sql` if you're pointing this at a fresh project. Row Level Security is on for both: a user can only read/update their own row.
3. That's it for sign-up/sign-in/profile editing — they work immediately once the two env vars above are set.

**Billing is intentionally not a card form.** The Billing section on `/account` never collects or stores a card number — that's a real security liability (PCI compliance) this template deliberately avoids. Once Paddle is connected (see below), "Manage payment method" should link to the customer's Paddle-hosted portal, where Paddle — not this app — holds the card data. `launchkit_orders` is ready to be filled by a Paddle webhook on successful checkout; that webhook isn't wired up yet.

## Connecting real checkout (Paddle)

This site does **not** create Paddle products for you — Paddle products, prices, and your account's identity/business verification only happen inside your own Paddle dashboard, which nothing here has access to. Three things to do there before checkout will work:

1. **Get your client-side token.** Paddle Dashboard → Developer Tools → Authentication → create a client-side token. Put it in `.env.local` as `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`.
2. **Create one Price per product.** Paddle Dashboard → Catalog → Products → New Product, once for each of the three products. Each product needs at least one Price; copy its Price ID (starts with `pri_`).
3. **Paste the Price IDs into `src/lib/products.ts`** — replace the placeholder `paddlePriceId` value on each product with the real one from step 2.

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

## Editing product content

Everything about a product — name, tagline, description, price, features, Paddle Price ID — is one object in the `products` array in `src/lib/products.ts`, with translatable fields as `{ en, ar }` pairs. Add a fourth product by adding a fourth object; it automatically appears on the home page, `/products`, and gets its own `/products/[slug]` page via `generateStaticParams`, in both languages.

## Deployment

```bash
npm run build
npm start
```

Set all the env vars from `.env.local.example` on your host (Vercel, Netlify, etc.) — they're read at build/runtime, not baked into the repo.
