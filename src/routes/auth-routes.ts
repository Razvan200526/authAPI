import { Hono } from 'hono';
import type { Container } from 'inversify';
import type { AuthModuleConfig } from '../config/types';
import type { LoginWithEmailAndPasswordController } from '../server/auth/controllers/loginWithEmailAndPasswordController';
import type { LoginWithUsernameController } from '../server/auth/controllers/loginWithUsernameAndPasswordController';
import type { LogoutUserController } from '../server/auth/controllers/logoutUserController';
import type { ResetPasswordController } from '../server/auth/controllers/resetPasswordController';
import type { SignUpWithEmailController } from '../server/auth/controllers/signUpWithEmailController';
import { createJwtMiddleware } from '../server/auth/middleware/jwtMiddlewareFactory';

export function createAuthRoutes(
  container: Container,
  config: AuthModuleConfig,
): Hono {
  const app = new Hono();

  const resetPasswordController = container.get<ResetPasswordController>(
    'ResetPasswordController',
  );
  const signupController = container.get<SignUpWithEmailController>(
    'SignUpWithEmailController',
  );
  const loginEmailController =
    container.get<LoginWithEmailAndPasswordController>(
      'LoginWithEmailAndPasswordController',
    );
  const loginUsernameController = container.get<LoginWithUsernameController>(
    'LoginWithUsernameController',
  );
  const logoutController = container.get<LogoutUserController>(
    'LogoutUserController',
  );

  // Public routes
  app.post('/signup/email', (c) => signupController.signupWithEmail(c));
  app.post('/login/email', (c) => loginEmailController.loginWithEmail(c));
  app.post('/login/username', (c) =>
    loginUsernameController.loginWithUsername(c),
  );
  app.post('/reset-password', (c) => resetPasswordController.resetPassword(c));
  app.get('/verify-reset/:token', (c) =>
    resetPasswordController.verifyResetToken(c),
  );
  app.post('/confirm-reset', (c) => resetPasswordController.confirmReset(c));

  const secret = config.jwt.secret;
  if (typeof secret !== 'string') {
    throw new Error(
      'JWT secret must be a string for HMAC (HS*) verification in middleware. ' +
        'If you are using a Buffer or key object, convert it to a string or switch to a compatible setup.',
    );
  }
  const jwtMw = createJwtMiddleware(secret);
  app.post('/logout', jwtMw, (c) => logoutController.logout(c));

  return app;
}
