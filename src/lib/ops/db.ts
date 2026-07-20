import postgres from "postgres";

// Same Postgres the Python engine writes to. The engine owns the schema;
// this app only reads leads/notices/runs and writes lead status + events.
const globalForSql = globalThis as unknown as { opsSql?: ReturnType<typeof postgres> };

export const sql =
  globalForSql.opsSql ??
  // prepare:false so this works through Supabase's transaction pooler
  // (pgbouncer), which serverless Vercel functions should use.
  postgres(process.env.DATABASE_URL ?? "", { max: 5, prepare: false });

if (process.env.NODE_ENV !== "production") globalForSql.opsSql = sql;
