import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
export const scores = sqliteTable('scores', { id: text('id').primaryKey(), classroom: integer('classroom').notNull(), student: integer('student').notNull(), score: integer('score').notNull(), createdAt: text('created_at').notNull() });
export const roster = sqliteTable('roster', { classroom: integer('classroom').notNull(), student: integer('student').notNull(), name: text('name').notNull() }, table => [primaryKey({columns:[table.classroom,table.student]})]);
