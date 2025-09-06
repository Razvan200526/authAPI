export declare class Mailer {
    private user;
    private password;
    private transporter;
    constructor(user: string, password: string);
    send(to: string[], subject: string, content: string, htmlContent?: string): Promise<boolean>;
    verifyConnection(): Promise<boolean>;
}
//# sourceMappingURL=mailer.d.ts.map