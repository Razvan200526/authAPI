import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import type { UserModel } from '../server/auth/models/userModel';

describe('Validation Isolated', () => {
	it('should validate email correctly with inline schema', () => {
		const schema = z.object({
			email: z.email(),
			username: z.string().min(2).max(100),
			password: z.string().min(1),
			role: z.enum(['guest', 'user', 'admin']).optional(),
		});

		const invalidUser = {
			email: 'invalid-email',
			username: 'testuser',
			password: 'password123',
		};

		const result = schema.safeParse(invalidUser);
		console.log('Inline schema result:', result);
		expect(result.success).toBe(false);

		// Test the validation function directly
		const validateUserInline = (user: UserModel): boolean => {
			const result = schema.safeParse(user);
			return result.success;
		};

		const validationResult = validateUserInline(invalidUser);
		console.log('Inline validateUser result:', validationResult);
		expect(validationResult).toBe(false);
	});
});
