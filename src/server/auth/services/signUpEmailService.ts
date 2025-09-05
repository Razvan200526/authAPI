import { hash } from 'bcryptjs';
import { User } from '../models/user';
import type { UserModel } from '../types';
export const createUserService = async (user: UserModel) => {
	const { username, email, password, role } = user;
	const hashedPassword = await hash(password, 10);

	const createdUser = new User({
		username,
		email,
		password: hashedPassword,
		role,
	});

	const savedUser = await createdUser.save();
	return savedUser;
};
