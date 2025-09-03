# AI Learning Hub

A modern web-based learning platform built by The AI Society at ASU to help students visualize and understand machine learning concepts through interactive experiences.

## Project Overview

AI Learning Hub is a Next.js application that provides an engaging platform for AI education. The frontend features a modern design with smooth animations, responsive layout, and intuitive navigation to guide users through their AI learning journey.

## Tech Stack

- **Framework:** Next.js 15 with Turbopack
- **Runtime:** React 19
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Code Quality:** Biome (linting & formatting)

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── about/             # About The AI Society
│   ├── learn/             # Learning content (coming soon)
│   ├── waitlist/          # Waitlist signup
│   ├── layout.tsx         # Root layout with navbar & footer
│   └── globals.css        # Global styles
├── components/
│   ├── home/              # Home page sections
│   └── ui/                # Reusable UI components
├── lib/                   # Utilities and constants
└── public/                # Static assets
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ml-visualization
   ```

2. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Check code quality with Biome
- `npm run format` - Format code with Biome

## Pages

### Home Page (`/`)

- Hero section with animated background
- Features grid showcasing platform capabilities
- Target audience section
- Vision and mission statement

### Learn Page (`/learn`)

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
