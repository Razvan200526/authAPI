import { injectable } from 'inversify';
import type { IPasswordResetMailer } from '../../config/types';

@injectable()
export class NoopPasswordResetMailer implements IPasswordResetMailer {
	// Keep the same shape as your real mailer. If `mailer` is a transporter, keep it optional/null-safe.
	// If it's required by the interface, set it to null and guard usage in your real implementation.
	// Adjust the type on the next line to match your real mailer type.
	async sendPasswordRecoveryEmail(): Promise<boolean> {
		console.warn(
			'Email service not configured - password reset email not sent',
		);
		return false;
	}
}
