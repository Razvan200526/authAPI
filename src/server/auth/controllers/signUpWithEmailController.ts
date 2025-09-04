import type { Context } from 'hono';
import jwt from 'jsonwebtoken';
import env from '../../../env';
import type { UserModel } from '../models/userModel';
import { validateUser } from '../models/validation';
import { createUserService } from '../services/signUpEmailService';

export const signUpWithEmailController = async (c: Context) => {
	try {
		const userData = (await c.req.json()) as UserModel;

		const valid = validateUser(userData);
		if (!valid) return c.json({ error: 'Invalid user data' }, 400);

		const newUser = await createUserService(userData);
		if (newUser[0]) {
			const accessToken = jwt.sign({ id: newUser[0].id }, env.JWT_SECRET, {
				expiresIn: '1m',
			});
			return c.json(
				{ accessToken: accessToken, message: 'User created successfully' },
				201,
			);
		}
	} catch (error) {
		if (error instanceof Error) {
			return c.json({ error: error.message }, 500);
		} else {
			throw new Error('Unexpected error');
		}
	}
};
