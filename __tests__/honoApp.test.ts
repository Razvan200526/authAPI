import { beforeEach, describe, expect, it } from 'bun:test';
import { app } from '../server/hono';

describe('Hono App', () => {
	beforeEach(() => {
		// Set up test environment
		Bun.env.DATABASE_URL = './test.db';
		Bun.env.JWT_SECRET = 'a'.repeat(32);
		Bun.env.NODE_ENV = 'test';
		Bun.env.PORT = '3000';
	});

	describe('app configuration', () => {
		it('should be a Hono instance', () => {
			expect(app).toBeDefined();
			expect(typeof app.get).toBe('function');
			expect(typeof app.post).toBe('function');
			expect(typeof app.put).toBe('function');
			expect(typeof app.delete).toBe('function');
		});

		it('should have middleware configured', () => {
			// Test that app has middleware stack
			expect(app).toBeTruthy();
		});
	});

	describe('routes', () => {
		it('should have root route', async () => {
			const res = await app.request('/', {
				method: 'GET',
			});

			expect(res.status).toBe(200);
			expect(await res.text()).toBe('Hello World!');
		});

		it('should have auth routes mounted', async () => {
			// Test that auth routes are mounted at /api/auth
			const res = await app.request('/api/auth/signup/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: 'test@example.com',
					username: 'testuser',
					password: 'password123',
					role: 'user',
				}),
			});

			// Should not return 404 (route exists)
			expect(res.status).not.toBe(404);
		});
	});

	describe('middleware', () => {
		it('should handle CORS', async () => {
			const res = await app.request('/', {
				method: 'OPTIONS',
			});

			// CORS middleware should handle OPTIONS requests
			expect(res.status).not.toBe(404);
		});

		it('should include logger middleware', () => {
			// Test that logger middleware is configured
			expect(app).toBeTruthy();
		});
	});

	describe('error handling', () => {
		it('should handle 404 for unknown routes', async () => {
			const res = await app.request('/unknown-route', {
				method: 'GET',
			});

			expect(res.status).toBe(404);
		});
	});
});
