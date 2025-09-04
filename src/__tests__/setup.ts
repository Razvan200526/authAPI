import { afterEach, beforeEach } from 'bun:test';

// Global test setup
beforeEach(() => {
	// Set up test environment variables
	Bun.env.DATABASE_URL = ':memory:'; // Use in-memory database for tests
	Bun.env.JWT_SECRET = 'test-jwt-secret-that-is-at-least-32-characters-long';
	Bun.env.NODE_ENV = 'test';
	Bun.env.PORT = '3001';
});

afterEach(() => {
	// Clean up after each test
	// Reset any global state if needed
});

// Test utilities
export const validUserData = {
	email: 'test@example.com',
	username: 'testuser',
	password: 'password123',
	role: 'user' as const,
};

// Helper function for creating mock user data
export const createMockUserData = (overrides = {}) => ({
	...validUserData,
	...overrides,
});
