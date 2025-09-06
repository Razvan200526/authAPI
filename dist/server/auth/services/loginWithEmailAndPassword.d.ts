interface LoginProps {
    email: string;
    password: string;
}
export declare const LoginWithEmailAndPasswordService: ({ email, password, }: LoginProps) => Promise<{
    id: number;
    email: string;
    password: string;
    role: "guest" | "user" | "admin" | null;
    status: "online" | "offline";
} | undefined>;
export {};
//# sourceMappingURL=loginWithEmailAndPassword.d.ts.map