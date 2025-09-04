import { eq } from 'drizzle-orm';
import { client } from '../../../database/db';
import { users } from '../../../database/schema';
import { validateUser } from './validation';
export type IUserRole = 'guest' | 'user' | 'admin';

export interface UserModel {
	email: string;
	username: string;
	password: string;
	role?: IUserRole;
}

export class User {
	private email: string;
	private username: string;
	private password: string;
	private role: IUserRole;
	private createdAt: string;
	private updatedAt: string;

	constructor(userData: UserModel) {
		validateUser(userData);
		this.email = userData.email;
		this.username = userData.username;
		this.password = userData.password;
		this.role = userData.role || 'guest';
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
		});
		console.log(
			await client.select().from(users).where(eq(users.email, this.email)),
		);

		return await client.select().from(users).where(eq(users.email, this.email));
	}
}
