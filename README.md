# Atendor MVP

This project is a minimal dashboard for managing AI chatbots. It uses Next.js 14, Tailwind CSS, Shadcn/ui and Supabase for authentication.

## Setup

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Create an `.env.local` file with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

Alternatively you can use environment variables named `SUPABASE_URL` and
`SUPABASE_PUBLIC`. When using these names, be sure they are exposed to the client
(for example by prefixing them with `NEXT_PUBLIC_` in `next.config.ts` or your
deployment settings).

## Features

- Supabase-backed API routes for creating and updating bots.
- Dashboard pages to list bots, create a new one and edit their flow using a simple React Flow editor.

