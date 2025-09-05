import { cyan, red, underline } from 'console-log-colors';
import env from './env';
import { app } from './server/hono';
import './server/mailer/startup';

Bun.serve({
	development: env.NODE_ENV === 'development',
	port: env.PORT,
	fetch: app.fetch,
});

console.log(
	cyan.bold(
		`Server running at ${underline(`http://localhost:${env.PORT}`)}`,
	),
);
