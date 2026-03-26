# Image Background Remover - Next.js + TailwindCSS

## Environment Variables

Create a `.env.local` file:

```bash
# remove.bg API Key (get from https://www.remove.bg/api)
REMOVE_BG_API_KEY=your-api-key-here

# API URL (optional, for production)
NEXT_PUBLIC_API_URL=/api/remove-bg
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployment.

### Set Environment Variables in Vercel

1. Go to your project settings
2. Add `REMOVE_BG_API_KEY` with your API key
