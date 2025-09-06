export type IUserRole = 'guest' | 'user' | 'admin';
export type IStatusType = 'online' | 'offline';
export interface UserModel {
    email: string;
    username: string;
    password: string;
    role?: IUserRole;
}
export interface LoginModel {
    email: string;
    password: string;
}
//# sourceMappingURL=types.d.ts.map