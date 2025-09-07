# @paladin11/authapi

A modern, TypeScript-first authentication module built for Bun applications using Hono framework and Drizzle ORM.

## Features

- 🔐 **Complete Authentication System**: Sign up, login, logout, and password reset
- 🏗️ **Dependency Injection**: Built with a clean IoC container pattern
- 🎯 **TypeScript First**: Full type safety and IntelliSense support
- ⚡ **Bun Optimized**: Built specifically for Bun runtime
- 🗄️ **Database Agnostic**: Works with SQLite, PostgreSQL, MySQL via Drizzle ORM
- 📧 **Email Integration**: Built-in email services for notifications
- 🛡️ **JWT Authentication**: Secure token-based authentication
- 🔑 **Password Security**: Bcrypt hashing with salt
- 🧪 **Well Tested**: Comprehensive test suite included

## Installation

```bash
bun add @paladin11/authapi
```

## Quick Start

### 1. Basic Setup

```typescript
import { AuthModule, type AuthModuleConfig } from '@paladin11/authapi';
import { Hono } from 'hono';

const app = new Hono();

const config: AuthModuleConfig = {
  database: {
    url: 'sqlite://./database.db',
    client: 'sqlite'
  },
  jwt: {
    secret: 'your-jwt-secret',
    expiresIn: '24h',
    algorithm: 'HS256'
  },
  email: {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    user: 'your-email@gmail.com',
    pass: 'your-app-password',
    from: 'noreply@yourapp.com'
  },
  routes: {
    prefix: '/auth',
    cors: {
      origin: '*',
      credentials: true
    }
  }
};

// Initialize the auth module
const authModule = new AuthModule(config);

// Mount auth routes
app.route('/auth', authModule.getRouter());

export default {
  port: 3000,
  fetch: app.fetch,
};
```

### 2. Advanced Setup with Custom Container

```typescript
import { createAuthContainer, AuthModuleConfig } from '@paladin11/authapi';

const config: AuthModuleConfig = {
  // ... your config
};

const container = createAuthContainer(config);
const authModule = container.resolve('AuthModule');
```

## Configuration

### AuthModuleConfig

```typescript
interface AuthModuleConfig {
  database: DatabaseConfig;
  jwt: JWTConfig;
  email?: EmailConfig; // Optional
  routes?: RouteConfig;
  logging?: {
    level?: 'debug' | 'info' | 'warn' | 'error';
    enabled?: boolean;
  };
  performance?: {
    enableJIT?: boolean;
    hotReload?: boolean;
  };
}
```

### Database Configuration

```typescript
interface DatabaseConfig {
  url: string;
  client?: 'pg' | 'mysql' | 'sqlite';
  skipInit?: boolean; // Skip schema initialization
  bunSqlite?: {
    create?: boolean;
    readwrite?: boolean;
    readonly?: boolean;
  };
  migrations?: {
    migrationsFolder?: string;
    migrationsTable?: string;
  };
}
```

### JWT Configuration

```typescript
interface JWTConfig {
  secret: string;
  expiresIn?: string; // e.g., '24h', '7d'
  refreshSecret?: string;
  refreshExpiresIn?: string;
  algorithm?: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512';
}
```

### Email Configuration

```typescript
interface EmailConfig {
  host: string;
  port: number;
  secure?: boolean;
  user: string;
  pass: string;
  from: string; // Required: sender email address
  timeout?: number;
}
```

## API Endpoints

Once initialized, the module provides these endpoints:

### Authentication Routes

- `POST /signup` - Register a new user
- `POST /login` - Login with email/username and password
- `POST /logout` - Logout user (requires JWT)
- `POST /reset-password` - Request password reset
- `POST /reset-password/confirm` - Confirm password reset

### Request/Response Examples

#### Sign Up
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "securePassword123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'
```

#### Password Reset
```bash
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

## Advanced Usage

### Using Individual Controllers

```typescript
import {
  SignUpWithEmailController,
  LoginWithEmailAndPasswordController,
  createAuthContainer
} from '@paladin11/authapi';

const container = createAuthContainer(config);

// Get individual controllers
const signUpController = container.resolve(SignUpWithEmailController);
const loginController = container.resolve(LoginWithEmailAndPasswordController);

// Use in your own routes
app.post('/custom-signup', async (c) => {
  return await signUpController.signUp(c);
});
```

### Custom Middleware

```typescript
import { createJwtMiddleware } from '@paladin11/authapi';

const jwtMiddleware = createJwtMiddleware(config.jwt.secret);

app.use('/protected/*', jwtMiddleware);
```

### Database Schema Access

```typescript
import { users, passwordResetTokens } from '@paladin11/authapi';

// Access the schema for custom queries
// users and passwordResetTokens are Drizzle schema objects
```

## Database Support

The module supports multiple databases through Drizzle ORM:

- **SQLite** (default) - Perfect for development and small applications
- **PostgreSQL** - Production-ready with advanced features
- **MySQL** - Wide compatibility and performance

### Database URLs Examples

```typescript
// SQLite
database: { url: 'sqlite://./app.db', client: 'sqlite' }

// PostgreSQL
database: { url: 'postgres://user:pass@localhost:5432/db', client: 'pg' }

// MySQL
database: { url: 'mysql://user:pass@localhost:3306/db', client: 'mysql' }

// Bun SQLite with options
database: {
  url: 'sqlite://./app.db',
  client: 'sqlite',
  bunSqlite: {
    create: true,
    readwrite: true
  }
}
```

## Environment Variables

You can use environment variables for configuration:

```bash
# Database
DATABASE_URL="sqlite://./app.db"
DATABASE_CLIENT="sqlite"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"
JWT_ALGORITHM="HS256"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
EMAIL_FROM="noreply@yourapp.com"

# Optional: Logging
LOG_LEVEL="info"
LOG_ENABLED="true"
```

## Testing

The module includes comprehensive tests. Run them with:

```bash
bun test
```

## Migration

The module automatically handles database migrations when initialized. The schema includes:

- **Users table**: Store user credentials and profile data
- **Password reset tokens table**: Manage password reset workflows

## Security Features

- **Password Hashing**: Uses bcryptjs with salt
- **JWT Tokens**: Secure authentication tokens
- **Input Validation**: Comprehensive request validation
- **Email Verification**: Built-in email workflows
- **Rate Limiting Ready**: Designed to work with rate limiting middleware

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- 📧 Email: [support@paladin11.dev](mailto:support@paladin11.dev)
- 🐛 Issues: [GitHub Issues](https://github.com/Razvan200526/authAPI/issues)
- 📖 Documentation: [GitHub Wiki](https://github.com/Razvan200526/authAPI/wiki)

## Changelog

### v1.0.1
- Added comprehensive README documentation
- Improved installation and usage instructions
- Added API endpoint examples with curl commands
- Enhanced configuration documentation

### v1.0.0
- Initial release
- Complete authentication system
- Dependency injection container
- Multi-database support
- Comprehensive test suite

---

Made with ❤️ for the Bun ecosystem
