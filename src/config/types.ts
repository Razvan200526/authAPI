import type { Algorithm, Secret, SignOptions } from 'jsonwebtoken';

export interface DatabaseConfig {
	url: string;
	client?: 'pg' | 'mysql' | 'sqlite';
	skipInit?: boolean; // Add this to allow skipping schema initialization
	// Bun-specific database options
	bunSqlite?: {
		create?: boolean;
		readwrite?: boolean;
		readonly?: boolean;
	};
	migrations?: {
		migrationsFolder?: string;
		migrationsTable?: string;
	};
}

export interface JWTConfig {
	secret: Secret;
	expiresIn?: SignOptions['expiresIn'];
	refreshSecret?: Secret;
	refreshExpiresIn?: SignOptions['expiresIn'];
	algorithm?: Algorithm;
}

export interface EmailConfig {
	host: string;
	port: number;
	secure?: boolean;
	user: string;
	pass: string;
	from: string;
	// Bun fetch options
	timeout?: number;
}

export interface RouteConfig {
	prefix?: string;
	cors?: {
		origin?: string | string[];
		credentials?: boolean;
	};
	rateLimit?: {
		windowMs?: number;
		max?: number;
	};
	excludeRoutes?: string[];
}

export interface AuthModuleConfig {
	database: DatabaseConfig;
	jwt: JWTConfig;
	email?: EmailConfig;
	routes?: RouteConfig;
	logging?: {
		level?: 'debug' | 'info' | 'warn' | 'error';
		enabled?: boolean;
	};
	// Bun-specific performance options
	performance?: {
		enableJIT?: boolean;
		hotReload?: boolean;
	};
}

// Bun-optimized default configuration
export const defaultConfig: Partial<AuthModuleConfig> = {
	routes: {
		prefix: '/auth',
		cors: {
			origin: '*',
			credentials: true,
		},
	},
	jwt: {
		expiresIn: '24h', // StringValue compatible
		algorithm: 'HS256',
		secret: 'your-jwt-secret',
	},
	logging: {
		level: 'info',
		enabled: true,
	},
	performance: {
		enableJIT: true,
		hotReload: process.env.NODE_ENV === 'development',
	},
};

export interface IPasswordResetMailer {
	sendPasswordRecoveryEmail(email: string, token: string): Promise<boolean>;
}
