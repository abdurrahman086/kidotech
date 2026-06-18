import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import { promises as dns } from "dns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PROJECT_REF = process.env.SUPABASE_PROJECT_ID!;
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD!;

const migrationsDir = resolve(__dirname, "../supabase/migrations");

async function resolveIPv4(host: string): Promise<string | null> {
  try {
    const addrs = await dns.resolve4(host);
    return addrs[0] || null;
  } catch {
    return null;
  }
}

async function tryConnect(
  host: string,
  port: number,
  user: string,
  password: string,
  database: string,
  label: string
): Promise<pg.Client | null> {
  const ip = await resolveIPv4(host);
  if (!ip) {
    console.log(`  ${label}: DNS resolution failed`);
    return null;
  }
  console.log(`  ${label} (${host} -> ${ip})...`);
  const client = new pg.Client({
    host: ip,
    port,
    user,
    password,
    database,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    console.log(`  ✅ Connected!`);
    return client;
  } catch (err: any) {
    console.log(`  ❌ ${(err.message || String(err)).slice(0, 100)}`);
    return null;
  }
}

async function main() {
  const poolerHost = `aws-0-ap-southeast-1.pooler.supabase.com`;
  const directHost = `db.${PROJECT_REF}.supabase.co`;

  let client: pg.Client | null = null;

  // Try pooler with both users
  for (const user of [`postgres.${PROJECT_REF}`, `postgres`]) {
    for (const port of [6543, 5432]) {
      client = await tryConnect(poolerHost, port, user, DB_PASSWORD, "postgres", `${user}@${poolerHost}:${port}`);
      if (client) break;
    }
    if (client) break;
  }

  // Try direct connection
  if (!client) {
    client = await tryConnect(directHost, 5432, "postgres", DB_PASSWORD, "postgres", `postgres@${directHost}`);
  }

  if (!client) {
    console.error("\n❌ Could not connect to database.");
    console.error("Gunakan Supabase SQL Editor manual.");
    process.exit(1);
  }

  // Apply migrations
  const migrationFiles = [
    "20260618015726_56cf3054-a833-4fe1-9682-df8f6ef40486.sql",
    "20260618015804_b2510245-6856-4333-b798-f68ca174fc1f.sql",
    "20260618020423_e118d7ce-ab82-4b51-b121-9d4bc340a738.sql",
  ];

  for (const file of migrationFiles) {
    const filePath = resolve(migrationsDir, file);
    const sql = readFileSync(filePath, "utf-8");
    console.log(`\n📝 Applying: ${file}...`);
    try {
      await client.query(sql);
      console.log(`  ✅ Complete`);
    } catch (err: any) {
      console.error(`  ❌ ${err.message}`);
      await client.end();
      process.exit(1);
    }
  }

  await client.end();
  console.log("\n🎉 All migrations applied successfully!");
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
