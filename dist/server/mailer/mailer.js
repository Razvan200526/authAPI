var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from 'inversify';
import nodemailer from 'nodemailer';
let Mailer = class Mailer {
    constructor(user, password) {
        this.user = user;
        this.password = password;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: this.user,
                pass: this.password
            }
        });
    }
    async send(to, subject, content, htmlContent) {
        try {
            const mailOptions = {
                from: this.user,
                to: to.join(','),
                subject,
                text: content,
                ...(htmlContent && { html: htmlContent })
            };
            const result = await this.transporter.sendMail(mailOptions);
            console.log(`Email sent successfully to ${to.length} recipient(s)`);
            return true;
        }
        catch (error) {
            console.error('Failed to send email:', error);
            return false;
        }
    }
    async verifyConnection() {
        try {
            await this.transporter.verify();
            return true;
        }
        catch (error) {
            console.error('SMTP connection verification failed:', error);
            return false;
        }
    }
};
Mailer = __decorate([
    injectable(),
    __param(0, inject('MAIL_USER')),
    __param(1, inject('MAIL_PASSWORD'))
], Mailer);
export { Mailer };
//# sourceMappingURL=mailer.js.map