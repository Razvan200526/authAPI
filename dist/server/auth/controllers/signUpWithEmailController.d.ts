import type { Context } from 'hono';
export declare const signUpWithEmailController: (c: Context) => Promise<(Response & import("hono").TypedResponse<{
    error: string;
}, 400, "json">) | (Response & import("hono").TypedResponse<{
    accessToken: string;
    message: string;
}, 201, "json">) | (Response & import("hono").TypedResponse<{
    error: string;
}, 500, "json">) | undefined>;
//# sourceMappingURL=signUpWithEmailController.d.ts.map