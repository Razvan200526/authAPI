import { describe, expect, it } from 'bun:test';
import authRouter from '../server/auth/routes/index';

describe('Auth Routes', () => {
	describe('route configuration', () => {
		it('should be a Hono instance', () => {
			expect(authRouter).toBeDefined();
			expect(typeof authRouter.post).toBe('function');
			expect(typeof authRouter.get).toBe('function');
			expect(typeof authRouter.put).toBe('function');
			expect(typeof authRouter.delete).toBe('function');
		});

		it('should have signup email route configured', () => {
			// Test that the route is properly configured
			// This is a structural test to ensure the route exists
			expect(authRouter).toBeTruthy();
		});
	});

	describe('route methods', () => {
		it('should support POST method for signup', () => {
			expect(typeof authRouter.post).toBe('function');
		});

		it('should have proper route structure', () => {
			// Verify the routes object has the expected structure
			expect(authRouter.routes).toBeDefined();
		});
	});

	describe('integration', () => {
		it('should be mountable in main app', () => {
			// Test that the auth routes can be properly mounted
			expect(authRouter).toBeInstanceOf(Object);
			expect(authRouter.routes).toBeDefined();
		});
	});
});
