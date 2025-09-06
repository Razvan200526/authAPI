import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import type { UserModel } from '../server/auth/models/userModel';

describe('Validation', () => {
	beforeEach(() => {
		// Clear all mocks before each test
		mock.restore();
	});

	afterEach(() => {
		// Clear all mocks after each test
		mock.restore();
	});

	describe('validateUser', () => {
		it('should return true for valid user', async () => {
			// Fresh import to avoid cached mocks
			const { validateUser } = await import(
				`../server/auth/models/validation?fresh=${Date.now()}`
			);

			const validUser: UserModel = {
				email: 'test@example.com',
				username: 'testuser',
				password: 'password123',
				role: 'user',
			};

			const result = validateUser(validUser);
			expect(result).toBe(true);
		});

		it('should return false for invalid user', async () => {
			// Fresh import to avoid cached mocks
			const { validateUser } = await import(
				`../server/auth/models/validation?fresh=${Date.now()}`
			);

			const invalidUser: UserModel = {
				email: 'invalid-email',
				username: 'testuser',
				password: 'password123',
			};

			const result = validateUser(invalidUser);
			expect(result).toBe(false);
		});

		it('should return false for short username', async () => {
			const { validateUser } = await import(
				`../server/auth/models/validation?fresh=${Date.now()}`
			);

			const invalidUser: UserModel = {
				email: 'test@example.com',
				username: 'a',
				password: 'password123',
			};

			const result = validateUser(invalidUser);
			expect(result).toBe(false);
		});
	});
});
