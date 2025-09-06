import jwt from 'jsonwebtoken';
import env from '../../../env';
import { validateLogin } from '../models/validation';
import { LoginWithEmailAndPasswordService } from '../services/loginWithEmailAndPassword';
export const LoginWithEmailAndPasswordController = async (c) => {
    try {
        const loginCredentials = await c.req.json();
        const { email, password } = loginCredentials;
        const valid = validateLogin(loginCredentials);
        if (!valid) {
            return c.json({ error: 'Invalid login credentials format' }, 400);
        }
        const user = await LoginWithEmailAndPasswordService({ email, password });
        if (!user) {
            return c.json({ error: 'Invalid login credentials' }, 401);
        }
        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            role: user.role,
        }, env.JWT_SECRET, { expiresIn: '24h' });
        return c.json({
            message: 'Login successful',
            accessToken: token,
        }, 200);
    }
    catch (error) {
        console.error('Login error:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
};
//# sourceMappingURL=loginWithEmailAndPasswordController.js.map