import { verify } from 'hono/jwt';
import env from '../../../env';
export const jwtMiddleware = async (c, next) => {
    try {
        const authHeader = c.req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ error: 'Authorization token required' }, 401);
        }
        const token = authHeader.substring(7);
        const payload = await verify(token, env.JWT_SECRET);
        // Store user info in context for use in controllers
        c.set('user', payload);
        await next();
    }
    catch (error) {
        console.error('JWT verification error:', error);
        return c.json({ error: 'Invalid or expired token' }, 401);
    }
};
//# sourceMappingURL=jwtMiddleware.js.map