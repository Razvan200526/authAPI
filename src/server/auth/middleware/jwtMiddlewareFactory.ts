import type { Context, Next } from 'hono';
import { verify } from 'hono/jwt';

export const createJwtMiddleware = (secret: string) => {
	return async (c: Context, next: Next) => {
		try {
			const authHeader = c.req.header('Authorization');
			if (!authHeader || !authHeader.startsWith('Bearer ')) {
				return c.json({ error: 'Authorization token required' }, 401);
			}
			const token = authHeader.substring(7);
			const payload = await verify(token, secret);
			c.set('user', payload);
			await next();
		} catch (error) {
			console.error('JWT verification error:', error);
			return c.json({ error: 'Invalid or expired token' }, 401);
		}
	};
};
