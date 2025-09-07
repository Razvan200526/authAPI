export type IUserRole = 'guest' | 'user' | 'admin';
export type IStatusType = 'online' | 'offline';

export interface AuthUser {
	id: number;
	email: string;
	username: string | null;
	password: string;
	role: IUserRole;
	status: IStatusType;
}

export interface CreateUserInput {
	email: string;
	username?: string;
	password: string;
	role?: IUserRole;
}

export interface IUserRepository {
	findByEmail(email: string): Promise<AuthUser | null>;
	findByUsername(username: string): Promise<AuthUser | null>;
	create(input: CreateUserInput): Promise<AuthUser>;
	setStatus(userId: number, status: IStatusType): Promise<void>;
}
