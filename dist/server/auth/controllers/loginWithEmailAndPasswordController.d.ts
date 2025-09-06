import type { Context } from 'hono';
export declare const LoginWithEmailAndPasswordController: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
    error: string;
}, 400, "json">) | (Response & import("hono").TypedResponse<{
    error: string;
}, 401, "json">) | (Response & import("hono").TypedResponse<{
    message: string;
    accessToken: string;
}, 200, "json">) | (Response & import("hono").TypedResponse<{
    error: string;
}, 500, "json">)>;
//# sourceMappingURL=loginWithEmailAndPasswordController.d.ts.map