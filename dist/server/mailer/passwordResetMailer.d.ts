import type { Mailer } from "./mailer";
export declare class PasswordResetMailer {
    private mailer;
    constructor(mailer: Mailer);
    sendPasswordRecoveryEmail(email: string, token: string): Promise<boolean>;
}
//# sourceMappingURL=passwordResetMailer.d.ts.map