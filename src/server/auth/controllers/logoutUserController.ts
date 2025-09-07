import type { Context } from 'hono';
import { inject, injectable } from 'inversify';
import type { IUserRepository } from '../repositories/IUserRepository';

@injectable()
export class LogoutUserController {
	constructor(@inject('UserRepository') private users: IUserRepository) {}

	async logout(c: Context) {
		try {
			const user = c.get('user');
			if (!user) {
				return c.json({ error: 'User information not found' }, 401);
			}

			const sub = user.sub ?? user.userId ?? user.id;
			if (!sub) {
				return c.json({ error: 'Invalid user ID in token' }, 401);
			}

			await this.users.setStatus(parseInt(sub, 10), 'offline');

			return c.json(
				{
					message: 'User successfully logged out',
					timestamp: new Date().toISOString(),
				},
				200,
			);
		} catch (error) {
			if (error instanceof Error) {
				return c.json({ error: error.message || 'Internal server error' }, 500);
			}
			console.error('Logout controller error:', error);
		}
	}
}
