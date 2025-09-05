import { eq } from 'drizzle-orm';
import { client } from '../../../database/db';
import { users } from '../../../database/schema';
import type { IStatusType, IUserRole, UserModel } from '../types';
import { validateUser } from './validation';

export class User {
	private email: string;
	private username: string;
	private password: string;
	private role: IUserRole;
	private status: IStatusType;
	private createdAt: string;
	private updatedAt: string;

	constructor(userData: UserModel) {
		if (!validateUser(userData)) throw new Error('Invalid user data');
		this.email = userData.email;
		this.username = userData.username;
		this.password = userData.password;
		this.role = userData.role || 'guest';
		this.status = 'online';
		this.createdAt = new Date().toISOString();
		this.updatedAt = new Date().toISOString();
	}

	async save() {
		await client.insert(users).values({
			email: this.email,
			username: this.username,
			password: this.password,
			role: this.role,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			status: this.status,
		});
		console.log(
			await client.select().from(users).where(eq(users.email, this.email)),
		);

		return await client.select().from(users).where(eq(users.email, this.email));
	}

	async get() {
		return await client.select().from(users).where(eq(users.email, this.email));
	}

	async update(status: IStatusType) {
		await client
			.update(users)
			.set({
				status: status,
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.email, this.email));
	}
}
