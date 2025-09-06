import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import authRouter from './auth/routes';
export const app = new Hono();

export class App {}
app.use(logger(), cors());
app.use('/', async (c) => c.text('Hello world', 200));
app.get('/api/hello', async (c) => {
	return c.json({ message: 'Hello world' });
});
app.route('/api/auth', authRouter);
