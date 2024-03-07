import { eq, AnyColumn, sql } from 'drizzle-orm';

import { db } from "../db/db";
import { Transaction, cardTokens, cards, transactions, wallets } from "../db/schema";
import CustomError from '../lib/customError';
import { CreatePaymentDto, QueryTransactionDto, UpdateTransactionDto, insertTransactonSchema } from '../types/transaction.types';
import { compareSecret, hashSecret } from '../lib/auth';

const decrement = (column: AnyColumn, value = 1) => {
    return sql`${column} - ${value}`;
};

export async function paymentTransactionService(dto: CreatePaymentDto): Promise<Transaction | undefined> {



    const cardToken = await db.query.cardTokens.findFirst({
        where: eq(cardTokens.token, dto.token),
        with: {
            card: true
        }
    })

    if (!cardToken) throw new CustomError("Invalid Token", 401)

    const finalDto = insertTransactonSchema.parse({
        cardId: cardToken.cardId,
        amount: dto.amount,
        walletId: cardToken.card.walletId
    })

    const transaction = await db.insert(transactions).values(finalDto).returning()

    await db.update(wallets)
        .set({
            amount: decrement(wallets.amount, dto.amount)
        })

    return transaction[0]
}

export async function getTransactionService(dto: QueryTransactionDto): Promise<Transaction | undefined> {

    const transaction = await db.query.transactions.findFirst({
        where: eq(transactions.id, dto.id)
    })

    if (!transaction) throw new CustomError("Transaction Doesnt Exist", 404)

    return transaction
}

export async function updateTransactionService(dto: UpdateTransactionDto): Promise<Transaction | undefined> {

    const transaction = await db.query.transactions.findFirst({
        where: eq(transactions.id, dto.transactionId)
    })

    if (!transaction) throw new CustomError("Transaction Doesnt Exist", 404)

    const updatedTransaction = await db.update(transactions).set({
        transactionStatus: dto.transactionStatus
    }).where(
        eq(transactions.id, dto.transactionId)
    ).returning()

    return updatedTransaction[0]
}

export async function deleteTransactionService(dto: QueryTransactionDto) {

    const transaction = await db.query.transactions.findFirst({
        where: eq(transactions.id, dto.id)
    })

    if (!transaction) throw new CustomError("Transaction Doesnt Exist", 404)

    await db.delete(transactions).where(
        eq(transactions.id, dto.id)
    )

}