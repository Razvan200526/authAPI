import { hash } from 'bcryptjs';
import type { Context } from 'hono';
import { inject, injectable } from 'inversify';
import { validateUser } from '../models/validation';
import type { IUserRepository } from '../repositories/IUserRepository';
import type { JwtService } from '../services/jwtService';
@injectable()
export class SignUpWithEmailController {
	constructor(
		@inject('UserRepository') private users: IUserRepository,
		@inject('JwtService') private jwt: JwtService,
	) {}

	async signupWithEmail(c: Context) {
		try {
			const body = await c.req.json();
			const { email, password, username, role } = body;

			const valid = validateUser({ email, password, username, role });
			if (!valid) {
				return c.json({ error: 'Invalid user data' }, 400);
			}

			const existing = await this.users.findByEmail(email);
			if (existing) {
				return c.json({ error: 'User already exists' }, 409);
			}

			const hashedPassword = await hash(password, 10);
			const created = await this.users.create({
				email,
				username,
				password: hashedPassword,
				role: role ?? 'user',
			});

			const token = this.jwt.signAccessToken({
				sub: String(created.id),
				email: created.email,
				role: created.role,
			});

			return c.json(
				{
					message: 'User created successfully',
					accessToken: token,
					user: {
						id: created.id,
						email: created.email,
						role: created.role,
					},
				},
				201,
			);
		} catch (error) {
			if (error instanceof Error) {
				return c.json({ error: error.message }, 500);
			}
			return c.json({ error: 'Internal server error' }, 500);
		}
	}
}
