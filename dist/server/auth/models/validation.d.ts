import { z } from 'zod';
import type { LoginModel, UserModel } from '../types';
export declare const userSchema: z.ZodObject<{
    email: z.ZodEmail;
    username: z.ZodString;
    password: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<{
        guest: "guest";
        user: "user";
        admin: "admin";
    }>>;
}, z.core.$strip>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const paswordResetSchema: z.ZodObject<{
    email: z.ZodEmail;
}, z.core.$strip>;
export declare const passwordResetConfirmSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, z.core.$strip>;
export declare const validatePasswordResetConfirm: (input: {
    token: string;
    password: string;
}) => boolean;
export declare const validatePasswordReset: (email: string) => boolean;
export declare const validateLogin: (login: LoginModel) => boolean;
export declare const validateUser: (user: UserModel) => boolean;
//# sourceMappingURL=validation.d.ts.map