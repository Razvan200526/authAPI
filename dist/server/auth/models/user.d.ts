import type { IStatusType, UserModel } from '../types';
export declare class User {
    private email;
    private username;
    private password;
    private role;
    private status;
    private createdAt;
    private updatedAt;
    constructor(userData: UserModel);
    save(): Promise<{
        id: number;
        username: string | null;
        email: string;
        password: string;
        status: "online" | "offline";
        role: "guest" | "user" | "admin" | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
    get(): Promise<{
        id: number;
        username: string | null;
        email: string;
        password: string;
        status: "online" | "offline";
        role: "guest" | "user" | "admin" | null;
        createdAt: string;
        updatedAt: string;
    }[]>;
    update(status: IStatusType): Promise<void>;
}
//# sourceMappingURL=user.d.ts.map