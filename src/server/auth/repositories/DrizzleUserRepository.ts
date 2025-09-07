import { eq } from 'drizzle-orm';
import { users } from '../../../database/schema';
import type {
	AuthUser,
	CreateUserInput,
	IUserRepository,
} from './IUserRepository';

export class DrizzleUserRepository implements IUserRepository {
	constructor(private db: any) {}

	async findByEmail(email: string): Promise<AuthUser | null> {
		const result = await this.db
			.select({
				id: users.id,
				email: users.email,
				username: users.username,
				password: users.password,
				role: users.role,
				status: users.status,
			})
			.from(users)
			.where(eq(users.email, email))
			.limit(1);
		return result[0] ?? null;
	}

	async findByUsername(username: string): Promise<AuthUser | null> {
		const result = await this.db
			.select({
				id: users.id,
				email: users.email,
				username: users.username,
				password: users.password,
				role: users.role,
				status: users.status,
			})
			.from(users)
			.where(eq(users.username, username))
			.limit(1);
		return result[0] ?? null;
	}

	async create(input: CreateUserInput): Promise<AuthUser> {
		const inserted = await this.db
			.insert(users)
			.values({
				email: input.email,
				username: input.username ?? null,
				password: input.password,
				role: input.role ?? 'user',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				status: 'online',
			})
			.returning({
				id: users.id,
				email: users.email,
				username: users.username,
				password: users.password,
				role: users.role,
				status: users.status,
			});
		return inserted[0];
	}

	async setStatus(userId: number, status: 'online' | 'offline'): Promise<void> {
		await this.db
			.update(users)
			.set({ status, updatedAt: new Date().toISOString() })
			.where(eq(users.id, userId));
	}
}
