import jwt, {
	type JwtPayload,
	type Secret,
	type SignOptions,
} from 'jsonwebtoken';

export interface AccessTokenPayload extends JwtPayload {
	sub: string; // user id
	email: string;
	role: 'guest' | 'user' | 'admin';
}

export class JwtService {
	constructor(
		private secret: Secret,
		private options: SignOptions = { expiresIn: '24h', algorithm: 'HS256' },
	) {}

	signAccessToken(payload: AccessTokenPayload): string {
		return jwt.sign(payload, this.secret, this.options);
	}

	verify<T>(token: string): T {
		return jwt.verify(token, this.secret) as T;
	}
}
