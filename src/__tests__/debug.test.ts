import { describe, expect, it } from 'bun:test';
import { users } from '../database/schema';

describe('Debug Schema', () => {
	it('should log schema structure', () => {
		console.log('Users table:', users);
		console.log('Users keys:', Object.keys(users));
		console.log('Users id:', users.id);
		console.log('Users email:', users.email);

		// Test basic access
		expect(users).toBeDefined();
		expect(users.id).toBeDefined();
		expect(users.email).toBeDefined();
	});
});
