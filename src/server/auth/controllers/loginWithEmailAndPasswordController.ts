import type { Context } from 'hono';
import { inject, injectable } from 'inversify';
import bcrypt from 'bcryptjs';
import { validateLogin } from '../models/validation';
import type { IUserRepository } from '../repositories/IUserRepository';
import { JwtService } from '../services/jwtService';
import type { LoginModel } from '../types';

@injectable()
export class LoginWithEmailAndPasswordController {
  constructor(
    @inject('UserRepository') private users: IUserRepository,
    @inject('JwtService') private jwt: JwtService
  ) {}

  async loginWithEmail(c: Context) {
    try {
      const loginCredentials: LoginModel = await c.req.json();
      const { email, password } = loginCredentials;

      const valid = validateLogin(loginCredentials);
      if (!valid) {
        return c.json({ error: 'Invalid login credentials format' }, 400);
      }

      const user = await this.users.findByEmail(email);
      if (!user) {
        return c.json({ error: 'Invalid login credentials' }, 401);
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
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
