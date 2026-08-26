# AI Pedia

## Tech Stack

## Project Overview
A modern web-based learning platform built by The AI Society at ASU to help students visualize and understand machine learning concepts through interactive experiences.A modern web-based learning platform built by The AI Society at ASU to help students visualize and understand machine learning concepts through interactive experiences.

## Getting Started

### Prerequisites

## Tech Stack

### Setup

```bash
git clone <repository-url>
cd ai-pedia
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:3000
```

### Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Biome check |
| `npm run format` | Biome format (writes) |

## Environment Variables

See `.env.example` for the full list. In short:

- `MONGODB_URI`, `MONGODB_DB_NAME` — database connection
- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET` — Discord OAuth app
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` — NextAuth
- `DISCORD_BOT_TOKEN`, `DISCORD_GUILD_ID`, `ADMIN_ROLE_ID` — server-side admin role verification
- `NEXT_PUBLIC_SITE_URL` — canonical site URL (SEO, sitemap)

## Project Structure

```
app/                      # App Router pages + API routes
  learn/                  # Category listing, module viewer, editor, authoring
  auth/signin/            # Discord sign-in page
  api/
    learn/                # Learn content CRUD, categories, edit locks, slug migration
    upload/image/         # Image upload (GridFS)
    images/[id]/          # Image streaming from GridFS
    auth/                 # NextAuth + role verification
components/
  visualizations/         # Interactive demos + registry (embedded in markdown)
  home/, auth/            # Page-specific components
  ui/                     # Shared UI (navbar, footer, buttons, ...)
lib/
  db/                     # Mongo client (raw driver), GridFS
  api/                    # Client-side API helpers (learn.ts)
  auth/                   # NextAuth config, Discord role checks, server guards
  markdown-utils.ts       # Heading extraction, content normalization
  slug.ts                 # Slug generation/parsing
  constants.ts, types.ts  # Site content constants, shared types
styles/                   # Markdown + editor CSS
types/                    # Ambient type declarations
docs/proposals/           # Design docs for unbuilt features
```

## How Content Works

- **Learn modules** are markdown documents stored in MongoDB with a slug of the form `<title-slug>_<objectId>`. Officers with the admin Discord role can create (`/learn/new`), edit, and delete modules in-app.
- **Interactive visualizations** are embedded by placing `<div id="VZ-..."></div>` (or a registered component name) in the markdown; the renderer swaps it for the matching React component from `components/visualizations/visualization-registry.tsx`.
- **Concurrent editing** is prevented with a per-module edit lock (5-minute TTL, heartbeat refresh); a second editor gets `423 Locked`.
- **Images** are uploaded to GridFS and served from `/api/images/[id]` with immutable caching.

## Contributing

Run `npm run lint` before pushing. There is no test suite yet — manual verification against a dev database is the current workflow.
