import { text, pgTable, uuid, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from 'zod';

export const users = pgTable('users', {
    id: uuid('id').defaultRandom().unique().primaryKey(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    phoneNumber: text('phone_number').unique().notNull(),
    createdAt: timestamp('created_at').defaultNow()
});

export type NewUser = typeof users.$inferInsert;

export const insertUserSchema = createInsertSchema(users, {
    email: (schema) => schema.email.email(),
    phoneNumber: z.string(),
    password: z.string().min(6),
});

export type User = typeof users.$inferSelect; // return type when queried

export const userRelations = relations(users, ({ one, many }) => ({
    wallet: one(wallets),
    cards: many(cards)
}));

export const wallets = pgTable('wallets', {
    id: uuid('id').unique().primaryKey(),
    balance: integer('amount').default(10).notNull(), // Gave the wallet a default of 10 for testing purposes
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const walletRelations = relations(wallets, ({ one, many }) => ({
    cards: many(cards),
    owner: one(users, {
        fields: [wallets.id],
        references: [users.id]
    })
}));

export const insertWalletSchema = createInsertSchema(wallets, {
    id: (schema) => schema.id.uuid()
});

export type Wallet = typeof wallets.$inferSelect;

export const cards = pgTable('cards', {
    id: uuid('id').defaultRandom().unique().primaryKey(),
    cardNumber: text('card_number').unique().notNull(),
    ccv: text('ccv',).notNull(), // Would have used a limited lenght varchar but I am hashing
    expiryMonth: integer('expiry_month').notNull(),
    expiryYear: integer('expiry_year').notNull(),
    walletId: uuid('wallet_id').notNull(),
    ownerId: uuid('owner_id').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const cardRelations = relations(cards, ({ one }) => ({
    wallet: one(wallets, {
        fields: [cards.walletId],
        references: [wallets.id]
    }),
    owner: one(users, {
        fields: [cards.ownerId],
        references: [users.id]
    })
}));

export const insertCardsSchema = createInsertSchema(cards, {
    cardNumber: z.string().length(16),
    ccv: z.string().length(3),
    expiryMonth: z.number().min(1).max(12),
    expiryYear: z.number().min(2023),
});

export type Card = typeof cards.$inferSelect;

export type NewCard = typeof cards.$inferInsert;


export const transactions = pgTable('transactions', {
    id: uuid('id').defaultRandom().unique().primaryKey(),
    cardId: uuid('card_id').notNull(),
    amount: integer('amount').notNull(),
    walletId: uuid('wallet_id').notNull(),
    transactionType: text('transaction_type', { enum: ['DEPOSIT', 'WITHDRAWAL'] }).notNull(),
    transactionStatus: text('transaction_status', { enum: ['SUCCESSFUL', 'PENDING', 'FAILED'] }).notNull(),
    timestamp: timestamp('timestamp').notNull().defaultNow(),
});

// create relation between transactions and cards and wallets
export const transactionRelations = relations(transactions, ({ one }) => ({
    card: one(cards, {
        fields: [transactions.cardId],
        references: [cards.id]
    }),
    wallet: one(wallets, {
        fields: [transactions.walletId],
        references: [wallets.id]
    })
}));

export type Transaction = typeof transactions.$inferSelect;

export type NewTransaction = typeof transactions.$inferInsert;

export const cardTokens = pgTable('card_tokens', {
    id: uuid('id').defaultRandom().unique().primaryKey(),
    cardId: uuid('card_id').notNull(),
    token: text('token').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const cardTokensRelations = relations(cardTokens, ({ one }) => ({
    card: one(cards, {
        fields: [cardTokens.cardId],
        references: [cards.id]
    })
}))

export const insertCardTokensSchema = createInsertSchema(cardTokens); // create a schema for inserting a card token

export type CardToken = typeof cardTokens.$inferSelect;

export type NewCardToken = typeof cardTokens.$inferInsert;