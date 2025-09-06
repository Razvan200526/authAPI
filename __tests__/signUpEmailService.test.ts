import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import type { UserModel } from '../server/auth/models/userModel';
import { createUserService } from '../server/auth/services/signUpEmailService';

// Mock bcryptjs
mock.module('bcryptjs', () => ({
	hash: mock(() => Promise.resolve('hashedPassword123')),
}));

// Mock User class
mock.module('../server/auth/models/userModel', () => ({
	User: mock().mockImplementation((userData: UserModel) => ({
		save: mock(() =>
			Promise.resolve([
				{
					id: 1,
					email: userData.email,
					username: userData.username,
					role: userData.role || 'guest',
					password: 'hashedPassword123',
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z',
				},
			]),
		),
	})),
}));

describe('SignUp Email Service', () => {
	let validUserData: UserModel;

	beforeEach(() => {
		validUserData = {
			email: 'test@example.com',
			username: 'testuser',
			password: 'password123',
			role: 'user',
		};

		mock.restore();
	});

	afterEach(() => {
		mock.restore();
	});

	describe('createUserService', () => {
		it('should hash password before creating user', async () => {
			const hashSpy = mock(() => Promise.resolve('hashedPassword123'));
			mock.module('bcryptjs', () => ({
				hash: hashSpy,
			}));

			await createUserService(validUserData);

			expect(hashSpy).toHaveBeenCalledWith('password123', 10);
		});

		it('should return saved user data', async () => {
			const result = await createUserService(validUserData);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect(result[0]).toHaveProperty('id');
			expect(result[0]).toHaveProperty('email', 'test@example.com');
		});

		it('should handle user without role', async () => {
			const userWithoutRole = {
				email: 'test@example.com',
				username: 'testuser',
				password: 'password123',
			};

			const result = await createUserService(userWithoutRole);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
		});

		it('should use bcrypt rounds of 10', async () => {
			const hashSpy = mock(() => Promise.resolve('hashedPassword123'));
			mock.module('bcryptjs', () => ({
				hash: hashSpy,
			}));

			await createUserService(validUserData);

			expect(hashSpy).toHaveBeenCalledWith(expect.any(String), 10);
		});
	});
});
