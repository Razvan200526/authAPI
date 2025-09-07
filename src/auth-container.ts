import { Container } from 'inversify';
import type { AuthModuleConfig, IPasswordResetMailer } from './config/types';
import { createDatabaseClient } from './database/client-factory';
import { LoginWithEmailAndPasswordController } from './server/auth/controllers/loginWithEmailAndPasswordController';
import { LoginWithUsernameController } from './server/auth/controllers/loginWithUsernameAndPasswordController';
import { LogoutUserController } from './server/auth/controllers/logoutUserController';
import { ResetPasswordController } from './server/auth/controllers/resetPasswordController';
import { SignUpWithEmailController } from './server/auth/controllers/signUpWithEmailController';
import { DrizzleUserRepository } from './server/auth/repositories/DrizzleUserRepository';
import type { IUserRepository } from './server/auth/repositories/IUserRepository';
import { JwtService } from './server/auth/services/jwtService';
import { Mailer } from './server/mailer/mailer';
import { NoopPasswordResetMailer } from './server/mailer/noopPasswordResetMailer';
import { PasswordResetMailer } from './server/mailer/passwordResetMailer';

export function createAuthContainer(config: AuthModuleConfig): Container {
  const container = new Container();

  // Bind configuration
  container.bind<AuthModuleConfig>('AuthConfig').toConstantValue(config);

  // Bind database client
  const dbClient = createDatabaseClient(config.database);
  container.bind('DatabaseClient').toConstantValue(dbClient);

  // Bind repository (close over dbClient; don't use ctx.container)
  container
    .bind<IUserRepository>('UserRepository')
    .toDynamicValue(() => new DrizzleUserRepository(dbClient))
    .inSingletonScope();

  // Bind JWT service with proper SignOptions
  container
    .bind<JwtService>('JwtService')
    .toDynamicValue(
      () =>
        new JwtService(config.jwt.secret, {
          expiresIn: config.jwt.expiresIn ?? '24h',
          algorithm: config.jwt.algorithm ?? 'HS256',
        }),
    )
    .inSingletonScope();

  // Handle mail configuration
  if (config.email) {
    container.bind('MAIL_CONFIG').toConstantValue(config.email);
    container.bind('Mailer').to(Mailer);
    container.bind<IPasswordResetMailer>('PasswordResetMailer').to(PasswordResetMailer);
  } else {
    container.bind<IPasswordResetMailer>('PasswordResetMailer').to(NoopPasswordResetMailer);
  }

  // Bind controllers
  container.bind<ResetPasswordController>('ResetPasswordController').to(ResetPasswordController);
  container.bind<SignUpWithEmailController>('SignUpWithEmailController').to(SignUpWithEmailController);
  container
    .bind<LoginWithEmailAndPasswordController>('LoginWithEmailAndPasswordController')
    .to(LoginWithEmailAndPasswordController);
  container.bind<LoginWithUsernameController>('LoginWithUsernameController').to(LoginWithUsernameController);
  container.bind<LogoutUserController>('LogoutUserController').to(LogoutUserController);

  return container;
}
