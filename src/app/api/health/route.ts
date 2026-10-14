import { generateText } from "ai";
import { sql } from "@/lib/db";

// Smoke test: one model call through AI Gateway, one write + read in Neon.
export async function GET() {
  const startedAt = Date.now();

  const { text } = await generateText({
    model: "anthropic/claude-haiku-5.5",
    prompt: "Reply with exactly: gateway ok",
  });

  await sql`CREATE TABLE IF NOT EXISTS health_checks (
    id serial PRIMARY KEY,
    reply text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  const [row] = await sql`INSERT INTO health_checks (reply) VALUES (${text}) RETURNING id, created_at`;
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM health_checks`;

  return Response.json({
    gateway: text,
    db: { insertedId: row.id, insertedAt: row.created_at, totalRows: count },
    ms: Date.now() - startedAt,
  });
}
