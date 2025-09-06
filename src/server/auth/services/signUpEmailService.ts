import { hash } from 'bcryptjs';
import { User } from '../models/user';
import type { IUserRole, UserModel } from '../types';
export const createUserService = async (user: UserModel) => {
	const { username, email, password, role } = user;
	const hashedPassword = await hash(password, 10);
	const defaultRole: IUserRole = 'user';
	const createdUser = new User({
		username,
		email,
		password: hashedPassword,
		role: role ? role : defaultRole,
	});

	const savedUser = await createdUser.save();
	return savedUser;
};
