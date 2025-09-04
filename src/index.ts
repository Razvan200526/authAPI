import { app } from "./server/hono";

Bun.serve({
	development: Bun.env.NODE_ENV === "development",
	port: Bun.env.PORT || 3000,
	fetch: app.fetch,
});

console.log(`Server running at http://localhost:${Bun.env.PORT || 3000}`);
