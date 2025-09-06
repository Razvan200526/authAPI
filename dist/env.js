export class Env {
    constructor() {
        this.DATABASE_URL = this.getRequiredEnvVar('DATABASE_URL');
        this.JWT_SECRET = this.getRequiredEnvVar('JWT_SECRET');
        this.JWT_REFRESH_TOKEN = this.getRequiredEnvVar('JWT_REFRESH_TOKEN');
        this.NODE_ENV = this.getEnvVar('NODE_ENV', 'development');
        this.PORT = this.getEnvVar('PORT', '3000');
        this.MAIL_USER = this.getRequiredEnvVar('MAIL_USER');
        this.MAIL_PASSWORD = this.getRequiredEnvVar('MAIL_PASSWORD');
        this.validateEnvironment();
    }
    getRequiredEnvVar(key) {
        const value = Bun.env[key];
        if (!value || value.trim() === '') {
            throw new Error(`Environment variable ${key} is required but not defined`);
        }
        return value.trim();
    }
    getEnvVar(key, defaultValue) {
        const value = Bun.env[key];
        return value && value.trim() !== '' ? value.trim() : defaultValue;
    }
    validateEnvironment() {
        const validEnvironments = ['development', 'production', 'test'];
        if (!validEnvironments.includes(this.NODE_ENV)) {
            throw new Error(`NODE_ENV must be one of: ${validEnvironments.join(', ')}`);
        }
        const portNum = parseInt(this.PORT, 10);
        if (Number.isNaN(portNum) || portNum < 1 || portNum > 65535) {
            throw new Error('PORT must be a valid port number (1-65535)');
        }
        if (this.JWT_SECRET.length < 32) {
            throw new Error('JWT_SECRET must be at least 32 characters long for security');
        }
        if (this.JWT_REFRESH_TOKEN.length < 32) {
            throw new Error('JWT_REFRESH_TOKEN must be at least 32 characters long for security');
        }
    }
    static getInstance() {
        if (!Env.instance) {
            Env.instance = new Env();
        }
        return Env.instance;
    }
}
const env = new Env();
export default env;
//# sourceMappingURL=env.js.map