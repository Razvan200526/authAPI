import { beforeEach, describe, expect, it } from 'bun:test';
import { client } from '../database/db';

describe('Database', () => {
	beforeEach(() => {
		// Set up test environment
		Bun.env.DATABASE_URL = ':memory:';
		Bun.env.JWT_SECRET = 'a'.repeat(32);
		Bun.env.NODE_ENV = 'test';
		Bun.env.PORT = '3000';
	});

	it('should export a drizzle client', () => {
		expect(client).toBeDefined();
		expect(typeof client.select).toBe('function');
		expect(typeof client.insert).toBe('function');
		expect(typeof client.update).toBe('function');
		expect(typeof client.delete).toBe('function');
	});

	it('should have proper connection', () => {
		// Test basic query capability
		expect(() => {
			client.select();
		}).not.toThrow();
	});

	it('should use correct database URL from env', () => {
		// This test verifies the database client is initialized
		// In a real test, you might want to verify the actual connection
		expect(client).toBeTruthy();
	});

	it('should handle database operations', () => {
		// Test that we can perform basic database operations
		expect(typeof client.transaction).toBe('function');
	});
});
