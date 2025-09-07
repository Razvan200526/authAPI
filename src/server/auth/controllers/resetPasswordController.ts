import bcrypt from 'bcryptjs';
import { and, eq, gt } from 'drizzle-orm';
import type { Context } from 'hono';
import { inject, injectable } from 'inversify';
import { passwordResetTokens, users } from '../../../database/schema';
import type { PasswordResetMailer } from '../../mailer/passwordResetMailer';
import {
	validatePasswordReset,
	validatePasswordResetConfirm,
} from '../models/validation';

async function sha256Hex(input: string): Promise<string> {
	const enc = new TextEncoder();
	const data = enc.encode(input);
	const hash = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

@injectable()
export class ResetPasswordController {
	constructor(
		@inject('PasswordResetMailer') private emailService: PasswordResetMailer,
		@inject('DatabaseClient') private db: any,
	) {}

	async resetPassword(c: Context) {
		try {
			const bodyEmail = await c.req
				.json()
				.then((data) => data.email as string | undefined)
				.catch(() => undefined);

			const email = bodyEmail;
			if (!email) {
				return c.json({ error: 'Email is required' }, 400);
			}

			if (!validatePasswordReset(email)) {
				return c.json({ error: 'Invalid email' }, 400);
			}

			const userResult = await this.db
				.select()
				.from(users)
				.where(eq(users.email, email))
				.limit(1);

			const user = userResult?.[0];
			if (!user) {
				// Don't reveal user existence
				return c.json(
					{ message: 'If the email exists, a reset link has been sent' },
					200,
				);
			}

			const token = crypto.randomUUID();
			const tokenHash = await sha256Hex(token);
			const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1h

			await this.db.insert(passwordResetTokens).values({
				userId: user.id,
				token: tokenHash, // store the hash
				expiresAt,
				isUsed: 0,
			});

			const sent = await this.emailService.sendPasswordRecoveryEmail(
				email,
				token,
			);
			if (!sent) {
				return c.json({ error: 'Failed to send email' }, 500);
			}

			return c.json({ message: 'Password reset email sent' }, 201);
		} catch (error) {
			if (error instanceof Error) {
				return c.json({ error: error.message }, 500);
			}
			return c.json({ error: 'Internal server error' }, 500);
		}
	}

	async verifyResetToken(c: Context) {
		try {
			const token = c.req.param('token');
			if (!token) {
				return c.json({ error: 'Token is required' }, 400);
			}

			const tokenHash = await sha256Hex(token);

			const tokenResult = await this.db
				.select({
					id: passwordResetTokens.id,
					userId: passwordResetTokens.userId,
					expiresAt: passwordResetTokens.expiresAt,
					isUsed: passwordResetTokens.isUsed,
				})
				.from(passwordResetTokens)
				.where(
					and(
						eq(passwordResetTokens.token, tokenHash),
						eq(passwordResetTokens.isUsed, 0),
						gt(passwordResetTokens.expiresAt, new Date().toISOString()),
					),
				)
				.limit(1);

			const rec = tokenResult?.[0];
			if (!rec) {
				return c.json({ error: 'Invalid or expired token' }, 400);
			}

			return c.json({
				message: 'Token is valid',
				userId: rec.userId,
				status: 200,
			});
		} catch (error) {
			console.error('Verify token error:', error);
			return c.json({ error: 'Internal server error' }, 500);
		}
	}

	async confirmReset(c: Context) {
		try {
			const { token, password } = await c.req.json<{
				token: string;
				password: string;
			}>();
			if (!validatePasswordResetConfirm({ token, password })) {
				return c.json({ error: 'Invalid token or password' }, 400);
			}

			const tokenHash = await sha256Hex(token);

			const [record] = await this.db
				.select({
					id: passwordResetTokens.id,
					userId: passwordResetTokens.userId,
					expiresAt: passwordResetTokens.expiresAt,
					isUsed: passwordResetTokens.isUsed,
				})
				.from(passwordResetTokens)
				.where(
					and(
						eq(passwordResetTokens.token, tokenHash),
						eq(passwordResetTokens.isUsed, 0),
						gt(passwordResetTokens.expiresAt, new Date().toISOString()),
					),
				)
				.limit(1);

			if (!record) {
				return c.json({ error: 'Invalid or expired token' }, 400);
			}

			const hashed = await bcrypt.hash(password, 10);

			await this.db
				.update(users)
				.set({ password: hashed })
				.where(eq(users.id, record.userId));
			await this.db
				.update(passwordResetTokens)
				.set({ isUsed: 1 })
				.where(eq(passwordResetTokens.id, record.id));

			return c.json({ message: 'Password reset successful' }, 200);
		} catch (error) {
			console.error('Confirm reset error:', error);
			return c.json({ error: 'Internal server error' }, 500);
		}
	}
}
