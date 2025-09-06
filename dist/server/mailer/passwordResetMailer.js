var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { inject, injectable } from "inversify";
let PasswordResetMailer = class PasswordResetMailer {
    constructor(mailer) {
        this.mailer = mailer;
    }
    async sendPasswordRecoveryEmail(email, token) {
        const subject = 'Password Reset';
        const resetUrl = `http://localhost:3000/api/reset-password/validate/${encodeURIComponent(token)}`;
        const body = `Dear ${email},\n\nPlease click the link below to reset your password:\n\n${resetUrl}\n\nBest regards,\nThe Example Team`;
        try {
            await this.mailer.send([email], subject, body);
            return true;
        }
        catch (error) {
            console.error('Failed to send password recovery email:', error);
            return false;
        }
    }
};
PasswordResetMailer = __decorate([
    injectable(),
    __param(0, inject('Mailer'))
], PasswordResetMailer);
export { PasswordResetMailer };
//# sourceMappingURL=passwordResetMailer.js.map