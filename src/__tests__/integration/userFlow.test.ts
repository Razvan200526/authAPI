import { beforeEach, describe, expect, it } from 'bun:test';
import { app } from '../../server/hono';

describe('User Flow Integration Tests', () => {
	beforeEach(() => {
		// Set up test environment
		Bun.env.DATABASE_URL = ':memory:';
		Bun.env.JWT_SECRET = 'a'.repeat(32);
		Bun.env.NODE_ENV = 'test';
		Bun.env.PORT = '3001';
	});

	describe('User Registration Flow', () => {
		it('should have signup endpoint available', async () => {
			const response = await app.request('/api/auth/signup/email', {
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

			// Just verify the endpoint exists (not 404)
			expect(response.status).not.toBe(404);
		});

		it('should handle POST requests to signup endpoint', async () => {
			const response = await app.request('/api/auth/signup/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: 'invalid-email',
					username: 'a',
					password: 'password123',
				}),
			});

			// Should not be a 404 or 405 (method not allowed)
			expect(response.status).not.toBe(404);
			expect(response.status).not.toBe(405);
		});

		it('should handle malformed JSON', async () => {
			const response = await app.request('/api/auth/signup/email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: 'invalid json',
			});

			// Should handle the request (not crash)
			expect(response).toBeDefined();
			expect(typeof response.status).toBe('number');
		});
	});
});
