import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';

const sqlite = new Database(Bun.env.DATABASE_URL);
export const client = drizzle(sqlite);
