import { createInsertSchema } from "drizzle-zod";
import { z } from 'zod';

import { users, wallets, cards, transactions, cardTokens } from "./schema";

// USER TYPES and SCHEMAS
export const insertUserSchema = createInsertSchema(users, {
    email: (schema) => schema.email.email(),
    phoneNumber: z.string(),
    password: z.string().min(6),
});

export type NewUser = typeof users.$inferInsert; // return type when inserting
export type User = typeof users.$inferSelect; // return type when queried

// WALLET TYPES and SCHEMAS
export const insertWalletSchema = createInsertSchema(wallets, { // ZOD verification schema for inserting a wallet
    id: (schema) => schema.id.uuid()
});

export type Wallet = typeof wallets.$inferSelect;

// CARD TYPES and SCHEMAS
export const insertCardsSchema = createInsertSchema(cards, { // ZOD verification schema for inserting a card
    cardNumber: z.string().length(16),
    ccv: z.string().length(3),
    expiryMonth: z.number().min(1).max(12),
    expiryYear: z.number().min(2023),
});

export type NewCard = typeof cards.$inferInsert;
export type Card = typeof cards.$inferSelect;

// TRANSACTION TYPES
export type NewTransaction = typeof transactions.$inferInsert;
export type Transaction = typeof transactions.$inferSelect;

// CARD TOKEN TYPES and SCHEMAS
export const insertCardTokensSchema = createInsertSchema(cardTokens); // ZOD verification schema for inserting a card token

export type NewCardToken = typeof cardTokens.$inferInsert;
export type CardToken = typeof cardTokens.$inferSelect;