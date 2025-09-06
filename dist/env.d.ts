export declare class Env {
    readonly DATABASE_URL: string;
    readonly JWT_SECRET: string;
    readonly NODE_ENV: string;
    readonly JWT_REFRESH_TOKEN: string;
    readonly PORT: string;
    readonly MAIL_USER: string;
    readonly MAIL_PASSWORD: string;
    private static instance;
    constructor();
    private getRequiredEnvVar;
    private getEnvVar;
    private validateEnvironment;
    static getInstance(): Env;
}
declare const env: Env;
export default env;
//# sourceMappingURL=env.d.ts.map