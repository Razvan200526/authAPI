import { z } from 'zod';
import type { LoginModel, UserModel } from '../types';

export const userSchema = z.object({
	email: z.email(),
	username: z.string().min(2).max(100),
	password: z.string().min(1),
	role: z.enum(['guest', 'user', 'admin']).optional(),
});

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
});

export const validateLogin = (login: LoginModel): boolean => {
	try {
		const result = loginSchema.safeParse(login);
		console.log('validateLogin - input:', login);
		console.log('validateLogin - schema result:', result);
		return result.success;
	} catch (error) {
		console.log('validateLogin - error:', error);
		return false;
	}
};

export const validateUser = (user: UserModel): boolean => {
	try {
		const result = userSchema.safeParse(user);
		console.log('validateUser - input:', user);
		console.log('validateUser - schema result:', result);
		return result.success;
	} catch (error) {
		console.log('validateUser - error:', error);
		return false;
	}
};
