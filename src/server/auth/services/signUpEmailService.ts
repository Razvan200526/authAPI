import { hash } from 'bcryptjs';
import { User, type UserModel } from '../models/userModel';

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
