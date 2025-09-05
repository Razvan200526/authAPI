import { injectable, inject } from "inversify";
import type { PasswordResetMailer } from "../../mailer/passwordResetMailer";
import type { Context } from "hono";
import { validatePasswordReset } from "../models/validation";

@injectable()
export class ResetPasswordController {
  constructor(@inject('PasswordResetMailer') private emailService: PasswordResetMailer) { }

  async resetPassword(c : Context){
    try{
      const email = c.req.param('email');
      const valid = validatePasswordReset(email);
      if(!valid){
        return c.json({ error: 'Invalid email' } , 400);
      }

      const recoveryEmail = await this.emailService.sendPasswordRecoveryEmail(email);
      if(!recoveryEmail){
        return c.json({ error: 'Failed to send email' } , 500);
      }

      return c.json({
        message : 'Password reset email sent',
        recoveryEmail,
        status : 201
      })

    }catch(error){
      return c.json({error : 'Internal server error'} , 500)
    }
  }
}
