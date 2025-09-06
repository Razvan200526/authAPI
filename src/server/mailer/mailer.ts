import { inject, injectable } from 'inversify';
import nodemailer from 'nodemailer';

@injectable()
export class Mailer {
	private transporter: nodemailer.Transporter;

	constructor(
		@inject('MAIL_USER') private user: string,
		@inject('MAIL_PASSWORD') private password: string,
	) {
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			host: 'smtp.gmail.com',
			port: 465,
			secure: true,
			auth: {
				user: this.user,
				pass: this.password,
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
				from: this.user,
				to: to.join(','),
				subject,
				text: content,
				...(htmlContent && { html: htmlContent }),
			};

			const result = await this.transporter.sendMail(mailOptions);
			if (!result) {
				throw new Error('Mailsender failed');
			}
			console.log(`Email sent successfully to ${to.length} recipient(s)`);
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
