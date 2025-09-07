import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { drizzle as drizzleMysql } from 'drizzle-orm/mysql2';
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres';
import mysql from 'mysql2/promise';
import { Pool } from 'pg';
import type { DatabaseConfig } from '../config/types';
import * as schema from './schema';

export function createDatabaseClient(config: DatabaseConfig) {
	switch (config.client) {
		case 'pg': {
			const pool = new Pool({
				connectionString: config.url,
			});
			return drizzleNode(pool, { schema });
		}

		case 'mysql': {
			const connection = mysql.createPool(config.url);
			return drizzleMysql(connection, { schema, mode: 'default' });
		}

		case 'sqlite':
		default: {
			// Bun's native SQLite support
			const sqlite = new Database(config.url, {
				create: config.bunSqlite?.create ?? true,
				readwrite: config.bunSqlite?.readwrite ?? true,
				readonly: config.bunSqlite?.readonly ?? false,
			});

			return drizzle(sqlite, { schema });
		}
	}
}
