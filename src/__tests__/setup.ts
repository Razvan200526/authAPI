import { beforeAll } from 'bun:test';

beforeAll(() => {
	// Set test environment variables
	process.env.NODE_ENV = 'test';
	process.env.JWT_SECRET = 'test-secret-key-32-characters-long';
	process.env.DATABASE_URL = ':memory:';

	// Bun-specific test setup
	console.log(`Running tests with Bun ${process.versions.bun}`);
});
