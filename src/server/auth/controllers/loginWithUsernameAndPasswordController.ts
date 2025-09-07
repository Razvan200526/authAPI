import type { Context } from 'hono';
import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { validateLoginUsernameSchema } from '../models/validation';
import type { IUserRepository } from '../repositories/IUserRepository';
import { JwtService } from '../services/jwtService';
import type { LoginWithUsernameProps } from '../services/loginWithUsernameAndPasswordService';

@injectable()
export class LoginWithUsernameController {
  constructor(
    @inject('UserRepository') private users: IUserRepository,
    @inject('JwtService') private jwt: JwtService
  ) {}

  async loginWithUsername(c: Context) {
    try {
      const loginCredentials: LoginWithUsernameProps = await c.req.json();
      const valid = validateLoginUsernameSchema(loginCredentials);
      if (!valid) {
        return c.json({ error: 'Login credentials are invalid' }, 400);
      }

      const user = await this.users.findByUsername(loginCredentials.username);
      if (!user) {
        return c.json({ error: 'Invalid login credentials' }, 401);
      }

      const matchedPassword = await bcrypt.compare(loginCredentials.password, user.password);
      if (!matchedPassword) {
        return c.json({ error: 'Invalid login credentials' }, 401);
      }

      const token = this.jwt.signAccessToken({
        sub: String(user.id),
        email: user.email,
        role: user.role
      });

      return c.json(
        {
          message: 'Login successful',
          accessToken: token
        },
        200
      );
    } catch (error) {
      console.error('Login error:', error);
      return c.json({ error: 'Internal server error' }, 500);
    }
  }
}
