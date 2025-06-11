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
- Forgot password and password reset pages powered by Supabase.

## Password Reset Flow

1. From the login page, click **Forgot your password?**.
2. Enter your email on `/forgot-password` to receive a magic link.
3. Follow the link in your email, which opens `/reset-password`.
4. Choose a new password and submit the form to update your account.

