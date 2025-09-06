var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { and, eq, gt } from 'drizzle-orm';
import { inject, injectable } from 'inversify';
import { client } from '../../../database/db';
import { passwordResetTokens, users } from '../../../database/schema';
import { validatePasswordReset, validatePasswordResetConfirm } from '../models/validation';
import bcrypt from 'bcryptjs';
let ResetPasswordController = class ResetPasswordController {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async resetPassword(c) {
        try {
            const bodyEmail = await c.req.json().then((data) => data.email);
            const paramEmail = c.req.param('email');
            const email = bodyEmail || paramEmail;
            if (!email) {
                return c.json({ error: 'Email is required' }, 400);
            }
            const valid = validatePasswordReset(email);
            if (!valid) {
                return c.json({ error: 'Invalid email' }, 400);
            }
            const userResult = await client
                .select()
                .from(users)
                .where(eq(users.email, email))
                .limit(1);
            if (!userResult || userResult.length === 0) {
                return c.json({ error: "User doesn't exist" }, 400);
            }
            const user = userResult[0];
            if (!user) {
                return c.json({ error: "User doesn't exist" }, 400);
            }
            const token = crypto.randomUUID();
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
            await client.insert(passwordResetTokens).values({
                userId: user.id,
                token,
                expiresAt,
                isUsed: 0,
            });
            const recoveryEmail = await this.emailService.sendPasswordRecoveryEmail(email, token);
            if (!recoveryEmail) {
                return c.json({ error: 'Failed to send email' }, 500);
            }
            return c.json({
                message: 'Password reset email sent',
                recoveryEmail,
            }, 201);
        }
        catch (error) {
            if (error instanceof Error) {
                return c.json({ error: error.message }, 500);
            }
            return c.json({ error: 'Internal server error' }, 500);
        }
    }
    async verifyResetToken(c) {
        try {
            const token = c.req.param('token');
            if (!token) {
                return c.json({ error: 'Token is required' }, 400);
            }
            // Find valid, unused, non-expired token
            const tokenResult = await client
                .select({
                id: passwordResetTokens.id,
                userId: passwordResetTokens.userId,
                expiresAt: passwordResetTokens.expiresAt,
                isUsed: passwordResetTokens.isUsed,
            })
                .from(passwordResetTokens)
                .where(and(eq(passwordResetTokens.token, token), eq(passwordResetTokens.isUsed, 0), gt(passwordResetTokens.expiresAt, new Date().toISOString())))
                .limit(1);
            if (!tokenResult || tokenResult.length === 0) {
                return c.json({ error: 'Invalid or expired token' }, 400);
            }
            const res = tokenResult[0];
            if (!res) {
                return c.json({ error: 'Token not found' });
            }
            return c.json({
                message: 'Token is valid',
                userId: res.userId,
                status: 200,
            });
        }
        catch (error) {
            console.error('Verify token error:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    }
    async confirmReset(c) {
        try {
            const { token, password } = await c.req.json();
            if (!validatePasswordResetConfirm({ token, password })) {
                return c.json({ error: 'Invalid token or password' }, 400);
            }
            // Look up valid, unused token that hasn't expired
            const [record] = await client
                .select({
                id: passwordResetTokens.id,
                userId: passwordResetTokens.userId,
                expiresAt: passwordResetTokens.expiresAt,
                isUsed: passwordResetTokens.isUsed,
            })
                .from(passwordResetTokens)
                .where(and(eq(passwordResetTokens.token, token), eq(passwordResetTokens.isUsed, 0), gt(passwordResetTokens.expiresAt, new Date().toISOString())))
                .limit(1);
            if (!record) {
                return c.json({ error: 'Invalid or expired token' }, 400);
            }
            // Hash new password
            const hashed = await bcrypt.hash(password, 10);
            // Update user password
            await client
                .update(users)
                .set({ password: hashed })
                .where(eq(users.id, record.userId));
            // Mark token as used (single-use)
            await client
                .update(passwordResetTokens)
                .set({ isUsed: 1 })
                .where(eq(passwordResetTokens.id, record.id));
            return c.json({ message: 'Password reset successful' }, 200);
        }
        catch (error) {
            console.error('Confirm reset error:', error);
            return c.json({ error: 'Internal server error' }, 500);
        }
    }
};
ResetPasswordController = __decorate([
    injectable(),
    __param(0, inject('PasswordResetMailer'))
], ResetPasswordController);
export { ResetPasswordController };
//# sourceMappingURL=resetPasswordController.js.map