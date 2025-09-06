import type { Context } from 'hono';
import jwt from 'jsonwebtoken';
import env from '../../../env';
import { validateLoginUsernameSchema } from '../models/validation';
import {
	type LoginWithUsernameProps,
	loginWithUsernameAndPasswordService,
} from '../services/loginWithUsernameAndPasswordService';

export const LoginWithUsernameController = async (c: Context) => {
	try {
		const loginCredentials: LoginWithUsernameProps = await c.req.json();
		const valid = validateLoginUsernameSchema(loginCredentials);
		if (!valid) {
			return c.json({ error: 'Login credentials are invalid' }, 400);
		}

		const user = await loginWithUsernameAndPasswordService(loginCredentials);
		const token = jwt.sign(
			{
				userId: user.id,
				email: user.email,
				role: user.role,
			},
			env.JWT_SECRET,
			{ expiresIn: '24h' },
		);

		return c.json(
			{
				message: 'Login successful',
				accessToken: token,
			},
			200,
		);
	} catch (error) {
		console.error('Login error:', error);
		return c.json({ error: 'Internal server error' }, 500);
	}
};
