import { describe, expect, it } from 'bun:test';
import { users } from '../database/schema';

describe('Database Schema', () => {
	describe('users table', () => {
		it('should export users table', () => {
			expect(users).toBeDefined();
		});

		it('should have id column', () => {
			expect(users.id).toBeDefined();
		});

		it('should have email column', () => {
			expect(users.email).toBeDefined();
		});

		it('should have username column', () => {
			expect(users.username).toBeDefined();
		});

		it('should have password column', () => {
			expect(users.password).toBeDefined();
		});

		it('should have role column', () => {
			expect(users.role).toBeDefined();
		});
	});
});
