import type { Context } from 'hono';
export declare const logoutUserController: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
    error: string;
}, 401, "json">) | (Response & import("hono").TypedResponse<{
    message: string;
    timestamp: string;
}, 200, "json">) | (Response & import("hono").TypedResponse<{
    error: string;
}, 500, "json">) | undefined>;
//# sourceMappingURL=logoutUserController.d.ts.map