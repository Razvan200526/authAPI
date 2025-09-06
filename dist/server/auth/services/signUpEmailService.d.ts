import type { UserModel } from '../types';
export declare const createUserService: (user: UserModel) => Promise<{
    id: number;
    username: string | null;
    email: string;
    password: string;
    status: "online" | "offline";
    role: "guest" | "user" | "admin" | null;
    createdAt: string;
    updatedAt: string;
}[]>;
//# sourceMappingURL=signUpEmailService.d.ts.map