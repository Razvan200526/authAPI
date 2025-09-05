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

export const passwordResetTokens = table(
	'password_reset_token',
	{
		id: t.integer().primaryKey({ autoIncrement: true }),
		userId: t.integer().notNull(),
		token: t.text().notNull(),
		expiresAt: t.text('expires_at').notNull().default(sql`(CURRENT_TIMESTAMP)`),
		isUsed: t.integer().notNull().default(0),
	},
	(table) => ({
		tokenIdx: t.uniqueIndex('token_idx').on(table.token),
		userIdIdx: t.index('user_id_idx').on(table.userId),
	}),
);
