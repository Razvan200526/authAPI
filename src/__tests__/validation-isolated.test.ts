import { describe, expect, it } from 'bun:test';
import { z } from 'zod';
import type { UserModel } from '../server/auth/types';

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
		expect(result.success).toBe(false);

		const validateUserInline = (user: UserModel): boolean => {
			const r = schema.safeParse(user);
			return r.success;
		};

		const validationResult = validateUserInline(invalidUser as any);
		expect(validationResult).toBe(false);
	});
});
