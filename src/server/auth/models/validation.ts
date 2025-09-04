import * as z from 'zod';
import type { UserModel } from './userModel';

export const userSchema = z.object({
	email: z.email(),
	username: z.string().min(2).max(100),
	role: z.enum(['guest', 'user', 'admin']).optional(),
});

export const validateUser = (user: UserModel) => {
	if (!userSchema.safeParse(user).success) {
		return false;
	}
	return true;
};
