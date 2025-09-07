import { inject, injectable } from 'inversify';
import type { IPasswordResetMailer } from '../../config/types';
import type { Mailer } from './mailer';
import type { AuthModuleConfig } from '../../config/types';

@injectable()
export class PasswordResetMailer implements IPasswordResetMailer {
  constructor(@inject('Mailer') private mailer: Mailer, @inject('AuthConfig') private cfg: AuthModuleConfig) {}

  async sendPasswordRecoveryEmail(email: string, token: string): Promise<boolean> {
    const subject = 'Password Reset';
    const base = this.cfg.routes?.prefix ? `/api${this.cfg.routes.prefix}` : '/api/auth';
    const host = this.cfg.email?.host ?? 'localhost';
    const urlBase = `http://${host}:3000${base}/reset-password/validate`;
    const resetUrl = `${urlBase}/${encodeURIComponent(token)}`;
    const body = `Dear ${email},\n\nPlease click the link below to reset your password:\n\n${resetUrl}\n\nBest regards,\nThe Example Team`;

    try {
      await this.mailer.send([email], subject, body);
      return true;
    } catch (error) {
      console.error('Failed to send password recovery email:', error);
      return false;
    }
  }
}
