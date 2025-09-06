import { hash } from 'bcryptjs';
import { User } from '../models/user';
export const createUserService = async (user) => {
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
//# sourceMappingURL=signUpEmailService.js.map