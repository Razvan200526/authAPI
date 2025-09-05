import { eq } from 'drizzle-orm';
import { client } from '../../../database/db';
import { users } from '../../../database/schema';

export interface LogoutResult {
	success: boolean;
	message: string;
	timestamp: string;
}

export const logoutUserService = async (
	userId: number,
): Promise<LogoutResult> => {
	try {
		// Check if user exists
		const existingUser = await client
			.select({ id: users.id, status: users.status })
			.from(users)
			.where(eq(users.id, userId))
			.limit(1);

		if (!existingUser || existingUser.length === 0) {
			throw new Error('User not found');
		}

		// Update user status to offline
		await client
			.update(users)
			.set({
				status: 'offline',
				updatedAt: new Date().toISOString(),
			})
			.where(eq(users.id, userId));

		return {
			success: true,
			message: 'User successfully logged out',
			timestamp: new Date().toISOString(),
		};
	} catch (error) {
		console.error('Logout service error:', error);
		throw new Error('Failed to logout user');
	}
};
