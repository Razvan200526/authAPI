import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import authRouter from './auth/routes';
export const app = new Hono();

app.use(logger(), cors());

app.get('/', (c) => c.text('Hello World!'));
app.route('/api/auth', authRouter);
