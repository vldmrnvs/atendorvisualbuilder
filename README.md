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

## Features

- Supabase-backed API routes for creating and updating bots.
- Dashboard pages to list bots, create a new one and edit their flow using a simple React Flow editor.


## License

This project is released under the [MIT License](LICENSE).
