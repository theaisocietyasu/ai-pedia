# AI Pedia

An interactive encyclopedia of AI/ML built by [The AI Society at Arizona State University](https://github.com/ais-asu). Officers author markdown-based learn modules with embedded interactive visualizations; students browse them by category. Live at [aipedia.ais-asu.com](https://aipedia.ais-asu.com/).

## Tech Stack

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript 5
- **Styling:** Tailwind CSS 4, Framer Motion
- **Markdown:** react-markdown + remark/rehype plugins, KaTeX for math
- **Database:** MongoDB (raw driver; GridFS for images)
- **Auth:** NextAuth.js with Discord OAuth; admin actions are gated by a Discord server role check
- **Code quality:** Biome (lint + format)

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (Atlas works — make sure your IP is on the access list)
- A Discord OAuth application and a bot in your Discord server (for role checks)

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
