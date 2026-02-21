# AI Pedia


## Project Overview
A modern web-based learning platform built by The AI Society at ASU to help students visualize and understand machine learning concepts through interactive experiences.A modern web-based learning platform built by The AI Society at ASU to help students visualize and understand machine learning concepts through interactive experiences.



## Tech Stack



- **Framework:** Next.js 15AI Pedia is a Next.js application that provides an engaging platform for AI education. The frontend features a modern design with smooth animations, responsive layout, and intuitive navigation to guide users through their AI learning journey.

- **Runtime:** React 19

- **Language:** TypeScript 5## Tech Stack

- **Styling:** Tailwind CSS 4

- **Authentication:** NextAuth.js with Discord OAuth- **Framework:** Next.js 15 with Turbopack

- **Database:** MongoDB- **Runtime:** React 19

- **Code Quality:** Biome- **Language:** TypeScript 5

- **Styling:** Tailwind CSS 4

## Quick Start- **Animations:** Framer Motion

- **Icons:** Lucide React

### Prerequisites- **Code Quality:** Biome (linting & formatting)



- Node.js 18+## Project Structure

- MongoDB connection

- Discord OAuth application```

frontend/

### Setup├── app/                    # Next.js App Router pages

│   ├── page.tsx           # Home page

1. **Clone and install**│   ├── about/             # About The AI Society

   ```bash│   ├── learn/             # Learning content (coming soon)

   git clone <repository-url>│   ├── waitlist/          # Waitlist signup

   cd ml-visualization│   ├── layout.tsx         # Root layout with navbar & footer

   npm install│   └── globals.css        # Global styles

   ```├── components/

│   ├── home/              # Home page sections

2. **Configure environment**│   └── ui/                # Reusable UI components

   ├── lib/                   # Utilities and constants

   Copy `.env.example` to `.env` and fill in your values:└── public/                # Static assets

   ```bash```

   cp .env.example .env

   ```## Quick Start



   Required environment variables:### Prerequisites

   - `MONGODB_URI` - MongoDB connection string

   - `DISCORD_CLIENT_ID` - Discord OAuth client ID- Node.js 18+

   - `DISCORD_CLIENT_SECRET` - Discord OAuth client secret- npm or yarn

   - `NEXTAUTH_SECRET` - Random secret (generate with `openssl rand -base64 32`)

   - `DISCORD_BOT_TOKEN` - Discord bot token for role verification### Setup Instructions

   - `DISCORD_GUILD_ID` - Discord server ID

   - `ADMIN_ROLE_ID` - Discord role ID for admin access1. **Clone the repository**



3. **Start development server**   ```bash

   ```bash   git clone <repository-url>

   npm run dev   cd ml-visualization

   ```   ```



4. **Open browser**2. **Navigate to frontend directory**

   

   Navigate to `http://localhost:3000`   ```bash

   cd frontend

## Authentication & Authorization   ```



The application uses Discord OAuth for authentication with role-based access control:3. **Install dependencies**



- Users sign in with their Discord account (no database storage for auth)   ```bash

- Protected routes require Discord admin role verification   npm install

- Discord Bot API is used to verify roles in real-time   ```

- Sessions are stored as encrypted JWT tokens (no database needed)

4. **Start development server**

## Available Scripts

   ```bash

- `npm run dev` - Start development server   npm run dev

- `npm run build` - Build for production   ```

- `npm start` - Start production server

- `npm run lint` - Check code quality5. **Open your browser**

   Navigate to `http://localhost:3000`

## Project Structure

## Available Scripts

```

├── app/                    # Next.js App Router- `npm run dev` - Start development server with Turbopack

│   ├── api/               # API routes- `npm run build` - Build for production

│   ├── auth/              # Authentication pages- `npm start` - Start production server

│   ├── learn/             # Learning content- `npm run lint` - Check code quality with Biome

│   └── blogs/             # Blog posts- `npm run format` - Format code with Biome

├── components/            # React components

│   ├── auth/              # Auth components## Pages

│   ├── ui/                # UI components

│   └── visualizations/    # Interactive visualizations### Home Page (`/`)

└── lib/                   # Utilities & server code

    └── auth/              # Authentication logic- Hero section with animated background

```- Features grid showcasing platform capabilities

- Target audience section

---- Vision and mission statement



Built with ❤️ by The AI Society at Arizona State University### Learn Page (`/learn`)


- Coming soon placeholder with course previews
- Status cards showing development progress
- Call-to-action for waitlist signup

### About Page (`/about`)

- Information about The AI Society at ASU
- Team values and mission cards
- Social media links

### Waitlist Page (`/waitlist`)

- Email signup form for early access
- Benefits of joining the waitlist
- Success state confirmation

## Development

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling with inline styles where needed
- Framer Motion for smooth animations
- Component-based architecture

### Design System

- Consistent color palette (purple/pink gradients)
- Glass morphism effects
- Rounded button styling
- Responsive grid layouts

### External Links

- [Project Documentation](https://www.notion.so/theaisociety/ML-Visualization-2598867868b480b48ea1c907119fba78?source=copy_link)
- [Latest Updates](https://www.notion.so/theaisociety/Latest-Updates-25e8867868b4800f880acdc07aabf174?source=copy_link)
- [Developer Onboarding](https://www.notion.so/theaisociety/New-Developer-Start-here-25e8867868b480d29c95f68416a13ff8?source=copy_link)
- [Workflow Guidelines](https://www.notion.so/theaisociety/Workflow-2598867868b4803c92c7c3f9a46f3edf?source=copy_link)

---

Built with ❤️ by The AI Society team at Arizona State University
