import { red } from 'console-log-colors';
import container from '../di/container';
export async function initMailer() {
    const mailer = container.get('Mailer');
    const isConnected = await mailer.verifyConnection();
    if (!isConnected) {
        throw new Error('Failed to connect to email service');
    }
    console.log(red('Email service initialized successfully'));
}
//# sourceMappingURL=startup.js.map