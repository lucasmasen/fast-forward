import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Run `vercel env pull .env.local`.");
}

// HTTP driver: one round trip per query, no connection pool to manage.
export const sql = neon(process.env.DATABASE_URL);
