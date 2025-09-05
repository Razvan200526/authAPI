import { sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/sqlite-core';
import { sqliteTable as table } from 'drizzle-orm/sqlite-core';

export const users = table(
	'users',
	{
		id: t.integer().primaryKey({ autoIncrement: true }),
		username: t.text(),
		email: t.text().notNull(),
		password: t.text().notNull(),
		status: t.text().notNull().$type<'online' | 'offline'>().default('online'),
		role: t.text().$type<'guest' | 'user' | 'admin'>().default('guest'),
		createdAt: t.text('created_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
		updatedAt: t.text('updated_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
	},
	(table) => ({
		emailIdx: t.uniqueIndex('email_idx').on(table.email),
	}),
);
