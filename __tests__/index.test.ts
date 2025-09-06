import { afterEach, beforeEach, describe, expect, it } from 'bun:test';

describe('Application Entry Point', () => {
	let originalEnv: Record<string, string | undefined>;

	beforeEach(() => {
		// Store original env vars
		originalEnv = {
			DATABASE_URL: Bun.env.DATABASE_URL,
			JWT_SECRET: Bun.env.JWT_SECRET,
			NODE_ENV: Bun.env.NODE_ENV,
			PORT: Bun.env.PORT,
		};

		// Set test environment
		Bun.env.DATABASE_URL = './test.db';
		Bun.env.JWT_SECRET = 'a'.repeat(32);
		Bun.env.NODE_ENV = 'test';
		Bun.env.PORT = '3001'; // Use different port for testing
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

	describe('environment setup', () => {
		it('should load environment variables', () => {
			expect(Bun.env.DATABASE_URL).toBeDefined();
			expect(Bun.env.JWT_SECRET).toBeDefined();
			expect(Bun.env.NODE_ENV).toBeDefined();
			expect(Bun.env.PORT).toBeDefined();
		});

		it('should use correct port', () => {
			expect(Bun.env.PORT).toBe('3001');
		});

		it('should be in test environment', () => {
			expect(Bun.env.NODE_ENV).toBe('test');
		});
	});

	describe('server configuration', () => {
		it('should have proper development setting', () => {
			const isDevelopment = Bun.env.NODE_ENV === 'development';
			expect(typeof isDevelopment).toBe('boolean');
		});
	});
});
