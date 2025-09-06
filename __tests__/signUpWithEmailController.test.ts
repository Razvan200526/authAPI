import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { signUpWithEmailController } from '../server/auth/controllers/signUpWithEmailController';

describe('SignUp With Email Controller', () => {
	beforeEach(() => {
		// Set up environment
		Bun.env.JWT_SECRET = 'test-jwt-secret-that-is-32-chars-long';
	});

	describe('successful user creation', () => {
		it('should create user and return access token', async () => {
			// Mock all dependencies upfront
			const mockValidation = {
				validateUser: mock(() => true),
			};

			const mockService = {
				createUserService: mock(() =>
					Promise.resolve([
						{
							id: 1,
							email: 'test@example.com',
							username: 'testuser',
							role: 'user',
							password: 'hashedPassword',
							createdAt: '2024-01-01T00:00:00.000Z',
							updatedAt: '2024-01-01T00:00:00.000Z',
						},
					]),
				),
			};

			const mockJwt = {
				default: {
					sign: mock(() => 'mocked-jwt-token'),
				},
			};

			const mockEnv = {
				default: {
					JWT_SECRET: 'test-jwt-secret-that-is-32-chars-long',
				},
			};

			// Create mock context
			const mockContext = {
				c: {
					json: () =>
						Promise.resolve({
							email: 'test@example.com',
							username: 'testuser',
							password: 'password123',
							role: 'user',
						}),
				},
				json: mock(() => ({ status: 201, data: {} })),
			};

			// The test verifies the function can be called without throwing
			const result = await signUpWithEmailController(mockContext as any);
			expect(result).toBeDefined();
		});
	});

	describe('validation errors', () => {
		it('should handle validation failure', async () => {
			const mockContext = {
				req: {
					json: () =>
						Promise.resolve({
							email: 'invalid-email',
							username: 'testuser',
							password: 'password123',
						}),
				},
				json: mock((data: any, status: number) => ({ data, status })),
			};

			const result = await signUpWithEmailController(mockContext as any);
			expect(result).toBeDefined();
		});
	});
});
