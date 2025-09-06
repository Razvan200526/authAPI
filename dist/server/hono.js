import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import authRouter from './auth/routes';
export const app = new Hono();
app.use(logger(), cors());
app.get('/api/hello', async (c) => {
    return c.json({ message: 'Hello world' });
});
app.route('/api/auth', authRouter);
//# sourceMappingURL=hono.js.map