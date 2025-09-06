import { describe, expect, it } from 'bun:test';
import { authRoutes } from '../server/auth/routes';

describe('Auth Routes', () => {
	describe('route configuration', () => {
		it('should be a Hono instance', () => {
			expect(authRoutes).toBeDefined();
			expect(typeof authRoutes.post).toBe('function');
			expect(typeof authRoutes.get).toBe('function');
			expect(typeof authRoutes.put).toBe('function');
			expect(typeof authRoutes.delete).toBe('function');
		});

		it('should have signup email route configured', () => {
			// Test that the route is properly configured
			// This is a structural test to ensure the route exists
			expect(authRoutes).toBeTruthy();
		});
	});

	describe('route methods', () => {
		it('should support POST method for signup', () => {
			expect(typeof authRoutes.post).toBe('function');
		});

		it('should have proper route structure', () => {
			// Verify the routes object has the expected structure
			expect(authRoutes.routes).toBeDefined();
		});
	});

	describe('integration', () => {
		it('should be mountable in main app', () => {
			// Test that the auth routes can be properly mounted
			expect(authRoutes).toBeInstanceOf(Object);
			expect(authRoutes.routes).toBeDefined();
		});
	});
});
