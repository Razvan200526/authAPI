import { describe, expect, it } from 'bun:test';

describe('Simple Test', () => {
	it('should work', () => {
		expect(1 + 1).toBe(2);
	});

	it('should test zod', async () => {
		const z = await import('zod');
		const schema = z.object({
			email: z.email(),
		});

		const result = schema.safeParse({ email: 'test@example.com' });
		expect(result.success).toBe(true);
	});
});
