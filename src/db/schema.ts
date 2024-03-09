import { text, pgTable, uuid, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from 'zod';

// User Table Schema
export const users = pgTable('users', {
    id: uuid('id').defaultRandom().unique().primaryKey(),
    email: text('email').unique().notNull(),
    password: text('password').notNull(),
    phoneNumber: text('phone_number').unique().notNull(),
    createdAt: timestamp('created_at').defaultNow()
});

// Creating User Relations, where Each user has ONE wallet and MANY cards
export const userRelations = relations(users, ({ one, many }) => ({
    wallet: one(wallets),
    cards: many(cards)
}));

// Wallet Table Schema
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

// Card Table Schema
export const cards = pgTable('cards', {
    id: uuid('id').defaultRandom().unique().primaryKey(),
    cardNumber: text('card_number').unique().notNull(),
    ccv: text('ccv',).notNull(), // Would have used a limited lenght varchar but I am hashing the ccv so I give it a text data type
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

// Transactions Table Schema
export const transactions = pgTable('transactions', {
    id: uuid('id').defaultRandom().unique().primaryKey(),
    cardId: uuid('card_id').notNull(),
    amount: integer('amount').notNull(),
    walletId: uuid('wallet_id').notNull(),
    transactionType: text('transaction_type', { enum: ['DEPOSIT', 'WITHDRAWAL'] }).notNull(),
    transactionStatus: text('transaction_status', { enum: ['SUCCESSFUL', 'PENDING', 'FAILED'] }).notNull(),
    timestamp: timestamp('timestamp').notNull().defaultNow(),
});

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

// Card Tokens Table Schema
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

// Sperated Types and Validation Schema from the Schema.ts file to make it less congested