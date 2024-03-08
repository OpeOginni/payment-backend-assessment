import { z } from 'zod';
import { TransactionStatusEnum, TransactionTypeEnum } from './enums';

export const createCardTokenSchema = z
    .object({
        amount: z.number().positive(),
        cardNumber: z.string().length(16),
        ccv: z.string().length(3),
        expiryMonth: z.number().min(1).max(12),
        expiryYear: z.number(),
        transactionType: z.nativeEnum(TransactionTypeEnum).optional(),
    })

export const createPaymentSchema = z
    .object({
        token: z.string(),
        amount: z.number().positive(),
    })


export const insertTransactonSchema = z
    .object({
        cardId: z.string().uuid(),
        amount: z.number().positive(),
        walletId: z.string().uuid(),
        transactionStatus: z.enum(['SUCCESSFUL', 'PENDING', 'FAILED']),
        transactionType: z.enum(['DEPOSIT', 'WITHDRAWAL'])
    })
export const queryTransactionSchema = z
    .object({
        id: z.string().uuid(),
    })

// Since the only update we want to a transaction is to update the STATUS
export const updateTransactionSchema = z
    .object({
        transactionId: z.string().uuid(),
        transactionStatus: z.nativeEnum(TransactionStatusEnum),
    })

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
export type QueryTransactionDto = z.infer<typeof queryTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof updateTransactionSchema>;