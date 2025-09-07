import { Hono } from 'hono';
import { AuthModule } from '../src/index';

const app = new Hono();

// Initialize the auth module
const authModule = new AuthModule({
	database: {
		url: process.env.DATABASE_URL || ':memory:',
		client: 'sqlite',
	},
	jwt: {
		secret: process.env.JWT_SECRET || 'your-secret-key-32-characters-long',
		expiresIn: '24h',
	},
	email: {
		host: 'smtp.gmail.com',
		port: 587,
		user: process.env.EMAIL_USER!,
		pass: process.env.EMAIL_PASS!,
		from: 'noreply@yourapp.com',
	},
	routes: {
		prefix: '/api/auth',
	},
	logging: {
		enabled: true,
		level: 'info',
	},
});

// Mount the auth routes
app.route('/api', authModule.getRouter());

// Your other app routes
app.get('/', (c) => c.text('Hello from your app!'));

// Start the server
export default {
	port: 3000,
	fetch: app.fetch,
};

console.log('Server running on port 3000');
console.log('Auth endpoints available at /api/auth/*');
