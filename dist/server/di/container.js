import { Container } from 'inversify';
import env from '../../env';
import { ResetPasswordController } from '../auth/controllers/resetPasswordController';
import { Mailer } from '../mailer/mailer';
import { PasswordResetMailer } from '../mailer/passwordResetMailer';

const container = new Container();
// Bind environment variables as constants
container.bind('MAIL_USER').toConstantValue(env.MAIL_USER);
container.bind('MAIL_PASSWORD').toConstantValue(env.MAIL_PASSWORD);
// Bind Mailer service
container.bind('Mailer').to(Mailer).inSingletonScope();
// In your container.ts
container.bind('PasswordResetMailer').to(PasswordResetMailer);
container.bind('ResetPasswordController').to(ResetPasswordController);
export default container;
//# sourceMappingURL=container.js.map
