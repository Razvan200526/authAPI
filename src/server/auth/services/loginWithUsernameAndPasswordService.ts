import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { client } from '../../../database/db';
import { users } from '../../../database/schema';
export interface LoginWithUsernameProps {
	username: string;
	password: string;
}

export const loginWithUsernameAndPasswordService = async (
	input: LoginWithUsernameProps,
) => {
	try {
		const { username, password } = input;
		const userResult = await client
			.select({
				id: users.id,
				email: users.email,
				password: users.password,
				role: users.role,
				status: users.status,
			})
			.from(users)
			.where(eq(users.username, username))
			.limit(1);

		if (!userResult || userResult.length === 0) {
			throw new Error('User not found');
		}
		const user = userResult[0];
		if (!user) {
			throw new Error('User not found');
		}
		const matchedPassword = bcrypt.compare(password, user.password);
		if (!matchedPassword) {
			throw new Error('Email or password is invalid');
		}

		return user;
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
		throw error;
	}
};
