import { Database } from 'bun:sqlite';
import type { Hono } from 'hono';
import { Hono as HonoApp } from 'hono';
import { cors } from 'hono/cors';
import type { Container } from 'inversify';
import { Pool } from 'pg';
import { createAuthContainer } from './auth-container';
import type { AuthModuleConfig } from './config/types';
import { defaultConfig } from './config/types';
import { createAuthRoutes } from './routes/auth-routes';

export class AuthModule {
	private container: Container;
	private router: Hono;
	private config: AuthModuleConfig;

	constructor(userConfig: AuthModuleConfig) {
		this.config = this.mergeConfig(userConfig);

		// Initialize database schema only if explicitly requested
		this.initDatabaseSchema();

		this.container = createAuthContainer(this.config);
		this.router = new HonoApp();

		this.setupMiddleware();
		this.setupRoutes();
	}

	private initDatabaseSchema() {
		if (!this.config.database || this.config.database.skipInit !== false) {
			console.log('Skipping database initialization (use migrations).');
			return;
		}

		try {
			console.log('Initializing database schema...');

			switch (this.config.database.client) {
				case 'pg':
					this.initPostgresSchema();
					break;
				case 'mysql':
					this.initMySQLSchema();
					break;
				default:
					this.initSQLiteSchema();
					break;
			}

			console.log('Database schema initialized successfully');
		} catch (error) {
			console.error('Failed to initialize database schema:', error);
		}
	}

	private initSQLiteSchema() {
		if (!this.config.database) return;

		const db = new Database(this.config.database.url, {
			create: true,
		});

		db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT,
        password TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'online',
        role TEXT DEFAULT 'guest',
        created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        updated_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
      );

      CREATE TABLE IF NOT EXISTS password_reset_token (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        token TEXT NOT NULL,
        expires_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP),
        isUsed INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (userId) REFERENCES users(id)
      );

      CREATE UNIQUE INDEX IF NOT EXISTS email_idx ON users(email);
      CREATE UNIQUE INDEX IF NOT EXISTS token_idx ON password_reset_token(token);
      CREATE INDEX IF NOT EXISTS user_id_idx ON password_reset_token(userId);
    `);
	}

	private initPostgresSchema() {
		if (!this.config.database) return;

		const pool = new Pool({
			connectionString: this.config.database.url,
		});

		pool
			.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT,
        password TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'online',
        role TEXT DEFAULT 'guest',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS password_reset_token (
        id SERIAL PRIMARY KEY,
        userId INTEGER NOT NULL REFERENCES users(id),
        token TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        isUsed INTEGER DEFAULT 0
      );

      CREATE UNIQUE INDEX IF NOT EXISTS email_idx ON users(email);
      CREATE UNIQUE INDEX IF NOT EXISTS token_idx ON password_reset_token(token);
      CREATE INDEX IF NOT EXISTS user_id_idx ON password_reset_token(userId);
    `)
			.catch((err) => {
				console.error('PostgreSQL schema initialization error:', err);
			});
	}

	private initMySQLSchema() {
		console.warn('MySQL schema initialization not implemented automatically.');
		console.warn('Please manually create tables or use migrations.');
	}

	private mergeConfig(userConfig: AuthModuleConfig): AuthModuleConfig {
		return {
			...defaultConfig,
			...userConfig,
			routes: {
				...defaultConfig.routes,
				...userConfig.routes,
			},
			jwt: {
				...defaultConfig.jwt,
				...userConfig.jwt,
			},
			logging: {
				...defaultConfig.logging,
				...userConfig.logging,
			},
			database: {
				skipInit: true,
				...userConfig.database,
			},
		} as AuthModuleConfig;
	}

	private setupMiddleware() {
		if (this.config.routes?.cors) {
			this.router.use(
				'*',
				cors({
					origin: this.config.routes.cors.origin || '*',
					credentials: this.config.routes.cors.credentials || true,
				}),
			);
		}

		if (this.config.logging?.enabled) {
			this.router.use('*', async (c, next) => {
				const start = Date.now();
				await next();
				const ms = Date.now() - start;
				console.log(`${c.req.method} ${c.req.url} - ${ms}ms`);
			});
		}
	}

	private setupRoutes() {
		const authRoutes = createAuthRoutes(this.container, this.config);
		const prefix = this.config.routes?.prefix || '/auth';
		this.router.route(prefix, authRoutes);
	}

	getRouter(): Hono {
		return this.router;
	}

	getContainer(): Container {
		return this.container;
	}

	getConfig(): AuthModuleConfig {
		return this.config;
	}

	isEmailEnabled(): boolean {
		return !!this.config.email;
	}
}
