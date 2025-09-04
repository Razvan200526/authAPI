import * as t from 'drizzle-orm/sqlite-core';
import { sqliteTable as table } from 'drizzle-orm/sqlite-core';
export const users = table(
	'users',
	{
		id: t.int().primaryKey({ autoIncrement: true }),
		username: t.text('username'),
		email: t.text().notNull(),
		password: t.text().notNull(),
		role: t.text().$type<'guest' | 'user' | 'admin'>().default('guest'),
		createdAt: t.text('created_at').notNull().default('CURRENT_TIMESTAMP'),
		updatedAt: t.text('updated_at').notNull().default('CURRENT_TIMESTAMP'),
	},
	(table) => [t.uniqueIndex('email_idx').on(table.email)],
);
