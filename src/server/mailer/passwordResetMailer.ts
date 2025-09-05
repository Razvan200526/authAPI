import { inject, injectable } from "inversify";
import type { Mailer } from "./mailer";


@injectable()
export class PasswordResetMailer{
  constructor(@inject('Mailer') private mailer: Mailer) { }

  async sendPasswordRecoveryEmail(email : string , token : string) : Promise<boolean>{
    const subject = 'Password Reset';
    const resetUrl = `http://localhost:3000/api/reset-password/validate/${encodeURIComponent(token)}`;
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
