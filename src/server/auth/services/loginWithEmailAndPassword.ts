import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { client } from '../../../database/db';
import { users } from '../../../database/schema';

interface LoginProps {
	email: string;
	password: string;
}

export const LoginWithEmailAndPasswordService = async ({
	email,
	password,
}: LoginProps) => {
	try {
		const userResult = await client
			.select({
				id: users.id,
				email: users.email,
				password: users.password,
				role: users.role,
				status: users.status,
			})
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (userResult.length === 0) {
			throw new Error('User not found');
		}
		const user = userResult[0];
		if (!user) {
			throw new Error('User not found');
		}
		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			throw new Error('Invalid password');
		}
		return user;
	} catch (error) {
		if (error instanceof Error) {
			console.error(error.message);
		}
		console.error('Internal server error');
	}
};
