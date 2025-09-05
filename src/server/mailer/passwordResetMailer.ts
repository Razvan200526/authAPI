import { inject, injectable } from "inversify";
import type { Mailer } from "./mailer";


@injectable()
export class PasswordResetMailer{
  constructor(@inject('Mailer') private mailer: Mailer) { }

  async sendPasswordRecoveryEmail(email : string) : Promise<boolean>{
    const subject = 'Password Reset';
    const body = `Dear ${email},\n\nPlease click the link below to reset your password:\n\nhttp://example.com/reset-password/${email}\n\nBest regards,\nThe Example Team`;

    try {
      await this.mailer.send([email], subject, body);
      return true;
    } catch (error) {
      console.error('Failed to send password recovery email:', error);
      return false;
    }
  }
}
