import { inject, injectable } from 'inversify';
import nodemailer from 'nodemailer';
import type { EmailConfig } from '../../config/types';

@injectable()
export class Mailer {
  private transporter: nodemailer.Transporter;

  constructor(@inject('MAIL_CONFIG') private config: EmailConfig) {
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: !!this.config.secure,
      auth: {
        user: this.config.user,
        pass: this.config.pass,
      },
    });
  }

  public async send(
    to: string[],
    subject: string,
    content: string,
    htmlContent?: string,
  ): Promise<boolean> {
    try {
      const mailOptions = {
        from: this.config.from,
        to: to.join(','),
        subject,
        text: content,
        ...(htmlContent && { html: htmlContent }),
      };

      const result = await this.transporter.sendMail(mailOptions);
      if (!result) {
        throw new Error('Mailsender failed');
      }
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  public async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection verification failed:', error);
      return false;
    }
  }
}
