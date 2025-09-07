import 'reflect-metadata';
import { beforeEach, describe, expect, it, mock } from 'bun:test';

describe('SignUp With Email Controller (class)', () => {
	beforeEach(() => {
		process.env.JWT_SECRET = 'test-jwt-secret-that-is-32-chars-long';

		mock.module('bcryptjs', () => ({
			hash: (_password: string, _saltRounds: number) =>
				Promise.resolve('hashedPassword'),
		}));

		mock.module('jsonwebtoken', () => ({
			default: {
				sign: (_payload: any, _secret: string, _options: any) =>
					'mocked-jwt-token',
			},
			sign: (_payload: any, _secret: string, _options: any) =>
				'mocked-jwt-token',
		}));

		mock.module('drizzle-orm', () => ({
			eq: (..._args: any[]) => ({}),
			sql: (_strings: TemplateStringsArray, ..._vals: any[]) => ({}) as any,
		}));

		const dbMock = {
			client: {
				select: () => ({
					from: () => ({
						where: () => ({
							limit: () => Promise.resolve([]),
						}),
					}),
				}),
				insert: () => ({
					values: () => ({
						returning: () =>
							Promise.resolve([
								{ id: 1, email: 'test@example.com', role: 'user' },
							]),
					}),
				}),
			},
		};
		mock.module('../../../database/db', () => dbMock);
		mock.module('/Volumes/Projects/authApi/src/database/db', () => dbMock);
		mock.module('/Volumes/Projects/authApi/src/database/db.ts', () => dbMock);

		const schemaMock = {
			users: {
				id: 'id',
				email: 'email',
				username: 'username',
				password: 'password',
				role: 'role',
				createdAt: 'createdAt',
				updatedAt: 'updatedAt',
			},
		};
		mock.module('../../../database/schema', () => schemaMock);
		mock.module(
			'/Volumes/Projects/authApi/src/database/schema',
			() => schemaMock,
		);
		mock.module(
			'/Volumes/Projects/authApi/src/database/schema.ts',
			() => schemaMock,
		);

		mock.module('../models/validation', () => ({
			validateUser: (data: {
				email?: string;
				password?: string;
				username?: string;
			}) =>
				Boolean(data?.email?.includes('@') && data?.password && data?.username),
		}));
	});

	it('should create user and return access token (success path)', async () => {
		const { SignUpWithEmailController } = await import(
			'../server/auth/controllers/signUpWithEmailController'
		);

		const controller = new SignUpWithEmailController(
			// In real DI, dependencies injected; this test is focused on controller flow stubbed above
		) as any;

		const mockContext = {
			req: {
				json: () =>
					Promise.resolve({
						email: 'test@example.com',
						username: 'testuser',
						password: 'password123',
						role: 'user',
					}),
			},
			json: mock((data: any, status: number) => ({
				_data: data,
				_status: status,
			})),
		};

		await controller.signupWithEmail(mockContext as any);

		const calls = (mockContext.json as any).mock.calls;
		expect(calls.length).toBe(1);
		const [payload, status] = calls[0];

		expect(status).toBe(201);
		expect(payload).toEqual({
			message: 'User created successfully',
			accessToken: 'mocked-jwt-token',
			user: {
				id: 1,
				email: 'test@example.com',
				role: 'user',
			},
		});
	});
});
