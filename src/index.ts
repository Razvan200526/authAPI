// Main module class
export { AuthModule } from './auth-module';

// Container factory
export { createAuthContainer } from './auth-container';

// Configuration types
export type {
  AuthModuleConfig,
  DatabaseConfig,
  EmailConfig,
  JWTConfig,
  RouteConfig,
} from './config/types';
export { defaultConfig } from './config/types';

// Controllers (for advanced usage)
export { ResetPasswordController } from './server/auth/controllers/resetPasswordController';
export { SignUpWithEmailController } from './server/auth/controllers/signUpWithEmailController';
export { LoginWithEmailAndPasswordController } from './server/auth/controllers/loginWithEmailAndPasswordController';
export { LoginWithUsernameController } from './server/auth/controllers/loginWithUsernameAndPasswordController';
export { LogoutUserController } from './server/auth/controllers/logoutUserController';

// Database schema only
export * from './database/schema';

// Middleware
export { createJwtMiddleware } from './server/auth/middleware/jwtMiddlewareFactory';

// Validation utilities
export {
  validatePasswordReset,
  validatePasswordResetConfirm,
  validateUser,
} from './server/auth/models/validation';

// Types
export * from './server/auth/types';

// Bun-specific exports
export const BUN_VERSION = process.versions.bun;
export const isRunningInBun = typeof Bun !== 'undefined';
