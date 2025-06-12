export function validateEnv() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('\u26A0\uFE0F Supabase env vars are missing.');
  }
}
