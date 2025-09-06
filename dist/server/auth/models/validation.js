import { z } from 'zod';
export const userSchema = z.object({
    email: z.email(),
    username: z.string().min(2).max(100),
    password: z.string().min(1),
    role: z.enum(['guest', 'user', 'admin']).optional(),
});
export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});
export const paswordResetSchema = z.object({
    email: z.email(),
});
export const passwordResetConfirmSchema = z.object({
    token: z.string().min(10),
    password: z.string().min(8).max(100),
});
export const validatePasswordResetConfirm = (input) => {
    try {
        const result = passwordResetConfirmSchema.safeParse(input);
        return result.success;
    }
    catch {
        return false;
    }
};
export const validatePasswordReset = (email) => {
    try {
        const result = paswordResetSchema.safeParse({ email });
        console.log('validatePasswordReset - input:', email);
        console.log('validatePasswordReset - schema result:', result);
        return result.success;
    }
    catch (error) {
        console.log('validatePasswordReset - error:', error);
        return false;
    }
};
export const validateLogin = (login) => {
    try {
        const result = loginSchema.safeParse(login);
        console.log('validateLogin - input:', login);
        console.log('validateLogin - schema result:', result);
        return result.success;
    }
    catch (error) {
        console.log('validateLogin - error:', error);
        return false;
    }
};
export const validateUser = (user) => {
    try {
        const result = userSchema.safeParse(user);
        console.log('validateUser - input:', user);
        console.log('validateUser - schema result:', result);
        return result.success;
    }
    catch (error) {
        console.log('validateUser - error:', error);
        return false;
    }
};
//# sourceMappingURL=validation.js.map