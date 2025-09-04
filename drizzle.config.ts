import { defineConfig } from 'drizzle-kit';

const dbUrl = process.env.DATABASE_URL;
if (dbUrl === undefined) {
	throw new Error('DATABASE_URL is not defined');
}
export default defineConfig({
	dialect: 'sqlite',
	schema: './src/database/schema.ts',
	out: './src/migrations',
	dbCredentials: {
		url: dbUrl,
	},
});
