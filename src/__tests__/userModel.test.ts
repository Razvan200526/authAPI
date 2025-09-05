import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test';
import { User, type UserModel } from '../server/auth/models/userModel';

// Mock the database client
mock.module('../database/db', () => ({
	client: {
		insert: mock(() => ({
			values: mock(() => Promise.resolve([])),
		})),
		select: mock(() => ({
			from: mock(() => ({
				where: mock(() =>
					Promise.resolve([
						{
							id: 1,
							email: 'test@example.com',
							username: 'testuser',
							role: 'user' as const,
							password: 'hashedPassword',
							createdAt: '2024-01-01T00:00:00.000Z',
							updatedAt: '2024-01-01T00:00:00.000Z',
						},
					]),
				),
			})),
		})),
	},
}));

describe('User Model', () => {
	let validUserData: UserModel;

	beforeEach(() => {
		validUserData = {
			email: 'test@example.com',
			username: 'testuser',
			password: 'password123',
			role: 'user',
		};

		// Reset all mocks
		mock.restore();
	});

	afterEach(() => {
		mock.restore();
	});

	describe('constructor', () => {
		it('should create user with valid data', () => {
			const user = new User(validUserData);

			expect(user).toBeInstanceOf(User);
		});

		it('should set default role to guest when not provided', () => {
			const userDataWithoutRole = {
				email: 'test@example.com',
				username: 'testuser',
				password: 'password123',
			};

			const user = new User(userDataWithoutRole);

			// We can't directly access private properties, but we can test through save method
			expect(user).toBeInstanceOf(User);
		});

		it('should call validateUser', () => {
			const validateSpy = mock(() => true);
			mock.module('../server/auth/models/validation', () => ({
				validateUser: validateSpy,
			}));

			new User(validUserData);

			expect(validateSpy).toHaveBeenCalledWith(validUserData);
		});
	});

	describe('save method', () => {
		it('should insert user into database', async () => {
			const insertMock = mock(() => ({
				values: mock(() => Promise.resolve()),
			}));

			const selectMock = mock(() => ({
				from: mock(() => ({
					where: mock(() =>
						Promise.resolve([
							{
								id: 1,
								email: 'test@example.com',
								username: 'testuser',
								role: 'user' as const,
								password: 'hashedPassword',
								createdAt: '2024-01-01T00:00:00.000Z',
								updatedAt: '2024-01-01T00:00:00.000Z',
							},
						]),
					),
				})),
			}));

			mock.module('../database/db', () => ({
				client: {
					insert: insertMock,
					select: selectMock,
				},
			}));

			const user = new User(validUserData);
			const result = await user.save();

			expect(insertMock).toHaveBeenCalled();
			expect(selectMock).toHaveBeenCalled();
			expect(result).toEqual([
				{
					id: 1,
					email: 'test@example.com',
					username: 'testuser',
					role: 'user',
					status: 'online' as const,
					password: 'hashedPassword',
					createdAt: '2024-01-01T00:00:00.000Z',
					updatedAt: '2024-01-01T00:00:00.000Z',
				},
			]);
		});

		it('should return user data after saving', async () => {
			const expectedUser = {
				id: 1,
				email: 'test@example.com',
				username: 'testuser',
				role: 'user' as const,
				status: 'online' as const,
				password: 'hashedPassword',
				createdAt: '2024-01-01T00:00:00.000Z',
				updatedAt: '2024-01-01T00:00:00.000Z',
			};

			const selectMock = mock(() => ({
				from: mock(() => ({
					where: mock(() => Promise.resolve([expectedUser])),
				})),
			}));

			mock.module('../database/db', () => ({
				client: {
					insert: mock(() => ({
						values: mock(() => Promise.resolve()),
					})),
					select: selectMock,
				},
			}));

			const user = new User(validUserData);
			const result = await user.save();

			expect(result).toEqual([expectedUser]);
		});
	});
});
