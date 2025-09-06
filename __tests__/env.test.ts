import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { Env } from '../env';

describe('Env', () => {
	let originalEnv: Record<string, string | undefined>;

	beforeEach(() => {
		// Store original env vars
		originalEnv = {
			DATABASE_URL: Bun.env.DATABASE_URL,
			JWT_SECRET: Bun.env.JWT_SECRET,
			NODE_ENV: Bun.env.NODE_ENV,
			PORT: Bun.env.PORT,
		};

		// Clear singleton instance
		// @ts-expect-error - Accessing private static for testing
		Env.instance = undefined;
	});

	afterEach(() => {
		// Restore original env vars
		for (const [key, value] of Object.entries(originalEnv)) {
			if (value === undefined) {
				delete Bun.env[key];
			} else {
				Bun.env[key] = value;
			}
		}
	});

	describe('constructor', () => {
		it('should create instance with valid environment variables', () => {
			Bun.env.DATABASE_URL = './test.db';
			Bun.env.JWT_SECRET = 'a'.repeat(32);
			Bun.env.NODE_ENV = 'development';
			Bun.env.PORT = '3000';

			const env = new Env();

			expect(env.DATABASE_URL).toBe('./test.db');
			expect(env.JWT_SECRET).toBe('a'.repeat(32));
			expect(env.NODE_ENV).toBe('development');
			expect(env.PORT).toBe('3000');
		});

		it('should use default values for optional variables', () => {
			Bun.env.DATABASE_URL = './test.db';
			Bun.env.JWT_SECRET = 'a'.repeat(32);
			delete Bun.env.NODE_ENV;
			delete Bun.env.PORT;

			const env = new Env();

			expect(env.NODE_ENV).toBe('development');
			expect(env.PORT).toBe('3000');
		});

		it('should throw error for missing required DATABASE_URL', () => {
			delete Bun.env.DATABASE_URL;
			Bun.env.JWT_SECRET = 'a'.repeat(32);

			expect(() => new Env()).toThrow(
				'Environment variable DATABASE_URL is required but not defined',
			);
		});

		it('should throw error for missing required JWT_SECRET', () => {
			Bun.env.DATABASE_URL = './test.db';
			delete Bun.env.JWT_SECRET;

			expect(() => new Env()).toThrow(
				'Environment variable JWT_SECRET is required but not defined',
			);
		});

		it('should throw error for empty required variables', () => {
			Bun.env.DATABASE_URL = '   ';
			Bun.env.JWT_SECRET = 'a'.repeat(32);

			expect(() => new Env()).toThrow(
				'Environment variable DATABASE_URL is required but not defined',
			);
		});

		it('should throw error for invalid NODE_ENV', () => {
			Bun.env.DATABASE_URL = './test.db';
			Bun.env.JWT_SECRET = 'a'.repeat(32);
			Bun.env.NODE_ENV = 'invalid';

			expect(() => new Env()).toThrow(
				'NODE_ENV must be one of: development, production, test',
			);
		});

		it('should throw error for invalid PORT', () => {
			Bun.env.DATABASE_URL = './test.db';
			Bun.env.JWT_SECRET = 'a'.repeat(32);
			Bun.env.PORT = 'invalid';

			expect(() => new Env()).toThrow(
				'PORT must be a valid port number (1-65535)',
			);
		});

		it('should throw error for PORT out of range', () => {
			Bun.env.DATABASE_URL = './test.db';
			Bun.env.JWT_SECRET = 'a'.repeat(32);
			Bun.env.PORT = '70000';

			expect(() => new Env()).toThrow(
				'PORT must be a valid port number (1-65535)',
			);
		});

		it('should throw error for short JWT_SECRET', () => {
			Bun.env.DATABASE_URL = './test.db';
			Bun.env.JWT_SECRET = 'short';

			expect(() => new Env()).toThrow(
				'JWT_SECRET must be at least 32 characters long for security',
			);
		});
	});

	describe('getInstance', () => {
		it('should return singleton instance', () => {
			Bun.env.DATABASE_URL = './test.db';
			Bun.env.JWT_SECRET = 'a'.repeat(32);

			const env1 = Env.getInstance();
			const env2 = Env.getInstance();

			expect(env1).toBe(env2);
		});

		it('should create instance on first call', () => {
			Bun.env.DATABASE_URL = './test.db';
			Bun.env.JWT_SECRET = 'a'.repeat(32);

			const env = Env.getInstance();

			expect(env).toBeInstanceOf(Env);
		});
	});

	describe('validation edge cases', () => {
		it('should accept minimum valid PORT', () => {
			Bun.env.DATABASE_URL = './test.db';
			Bun.env.JWT_SECRET = 'a'.repeat(32);
			Bun.env.PORT = '1';

			const env = new Env();
			expect(env.PORT).toBe('1');
		});

		it('should accept maximum valid PORT', () => {
			Bun.env.DATABASE_URL = './test.db';
			Bun.env.JWT_SECRET = 'a'.repeat(32);
			Bun.env.PORT = '65535';

			const env = new Env();
			expect(env.PORT).toBe('65535');
		});

		it('should accept exactly 32 character JWT_SECRET', () => {
			Bun.env.DATABASE_URL = './test.db';
			Bun.env.JWT_SECRET = 'a'.repeat(32);

			const env = new Env();
			expect(env.JWT_SECRET).toBe('a'.repeat(32));
		});
	});
});
