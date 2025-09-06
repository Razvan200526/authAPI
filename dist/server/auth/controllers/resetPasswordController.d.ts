import type { Context } from 'hono';
import type { PasswordResetMailer } from '../../mailer/passwordResetMailer';
export declare class ResetPasswordController {
    private emailService;
    constructor(emailService: PasswordResetMailer);
    resetPassword(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
        recoveryEmail: true;
    }, 201, "json">)>;
    verifyResetToken(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
        userId: number;
        status: number;
    }, import("hono/utils/http-status").ContentfulStatusCode, "json">)>;
    confirmReset(c: Context): Promise<(Response & import("hono").TypedResponse<{
        error: string;
    }, 400, "json">) | (Response & import("hono").TypedResponse<{
        message: string;
    }, 200, "json">) | (Response & import("hono").TypedResponse<{
        error: string;
    }, 500, "json">)>;
}
//# sourceMappingURL=resetPasswordController.d.ts.map