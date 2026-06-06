# Mocellin Joias — E-commerce Platform

Production e-commerce for a Brazilian jewelry brand. Built end-to-end by [glim.](https://github.com/JuanGabrielGomes) — from database modeling to deployment.

**[→ Live demo](https://mocellin-ecommerce.vercel.app)**

---

## Overview

Mocellin Joias is a full-featured online store for a jewelry boutique. Customers browse products, build a cart, fill in shipping details, and complete the order via a pre-formatted WhatsApp message — no payment gateway required, by client's choice.

The platform includes a headless admin panel for the store owner to manage products, upload media, and run time-limited promotional campaigns that restyle the entire storefront in real time.

---

## Features

**Store**
- Product catalog with category filtering and full-text search
- Product detail page with image gallery (lightbox, swipe, focal-point per image) and video support
- Cart with per-item size selection, quantity controls, and `localStorage` persistence (Zustand)
- Checkout with automatic address fill-in via [ViaCEP](https://viacep.com.br) and shipping quotes via [Superfrete](https://superfrete.com) API
- WhatsApp checkout: order summary pre-formatted and sent directly to the store's WhatsApp number
- Dynamic SEO — `generateMetadata`, Open Graph, Twitter Card, dynamic sitemap, robots.txt

**Campaign system**
- Time-limited campaigns that override the storefront's color tokens, hero image, and top banner at runtime — no redeployment needed
- One active campaign at a time; toggling via the admin panel instantly changes the site's visual theme
- Preset themes: Valentine's Day, Black Friday, Christmas, Mother's Day

**Admin panel** (`/admin`, protected by middleware)
- Product management: create, edit, delete, toggle featured/sold-out
- Media upload: multiple images per product with per-image focal point selector; video support
- Related products selector with live search
- Campaign management: full color-token editor with color pickers and preset themes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, RSC, SSR) |
| Language | TypeScript 5 (strict, zero `any`) |
| Styling | Tailwind CSS v4 with `@theme` design tokens |
| State | Zustand 5 (cart, persisted) |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth (admin only) |
| Storage | Supabase Storage (images, videos, campaign assets) |
| Shipping API | Superfrete |
| Address API | ViaCEP |
| Deployment | Vercel |

---

## Architecture Notes

**Server vs. Client split** — pages and data-fetching components are Server Components by default; interactivity (`useState`, event handlers, Zustand) is pushed to leaf Client Components only.

**Request deduplication** — `getActiveCampaign()` and `getProduct(id)` are wrapped in React `cache()`, so parallel calls within the same request (e.g. layout + page) hit the database once.

**Campaign theming** — the active campaign injects a `<style>` block with CSS custom property overrides directly into the public layout. No client-side JS, no flash of unstyled content.

**WhatsApp checkout** — `buildWhatsAppUrl()` formats the complete order (items, sizes, quantities, shipping, payment method, delivery address) into a WhatsApp deep link. The browser opens the link, the cart clears, and the user is redirected back to the catalog.

**Shipping proxy** — a Next.js Route Handler (`/api/frete`) proxies requests to the Superfrete API, keeping the bearer token server-side.

---

## Getting Started

```bash
# 1. Clone and install
git clone https://github.com/JuanGabrielGomes/mocellin-ecommerce.git
cd mocellin-ecommerce
npm install

# 2. Configure environment variables
cp .env.example .env.local
# Fill in the values (see table below)

# 3. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key |
| `SUPERFRETE_TOKEN` | Bearer token for the Superfrete API |
| `SUPERFRETE_CEP_ORIGEM` | Origin zip code for shipping calculation |

---

## Project Structure

```
mocellin-ecommerce/
├── app/                    # Next.js App Router
│   ├── (public)/           # Storefront routes: /, /catalogo, /produto/[id], /checkout
│   ├── (admin)/admin/      # Admin panel: products, campaigns, login
│   └── api/frete/          # Shipping proxy (Superfrete)
├── src/
│   ├── components/
│   │   ├── product/        # ProductCard, ProductGallery, ProductActions
│   │   ├── cart/           # CartDrawer
│   │   ├── admin/          # ProductForm, CampaignForm, etc.
│   │   └── ui/             # Header, Footer, CampaignBanner, WhatsAppFloat
│   ├── hooks/
│   │   ├── useCepLookup.ts      # ViaCEP address auto-fill
│   │   └── useFreteSimulator.ts # Shipping quote with 600ms debounce
│   ├── lib/
│   │   ├── cart/           # Zustand store + WhatsApp URL builder
│   │   ├── supabase/       # Server and client Supabase instances
│   │   ├── campaign.ts     # getActiveCampaign() with React cache()
│   │   └── config.ts       # Single source of truth for store constants
│   └── types/index.ts      # All TypeScript types
├── supabase/migrations/    # SQL migrations
├── docs/PROJETO.md         # Full technical documentation (PT-BR)
└── proxy.ts                # Auth middleware — protects /admin/*
```

---

## Documentation

Full technical documentation in Portuguese — database schema, component API, cart flow diagrams, campaign system, scalability roadmap — is in [`docs/PROJETO.md`](./docs/PROJETO.md).

---

## Built by

**[glim.](https://github.com/JuanGabrielGomes)** — boutique web engineering and digital design studio.
