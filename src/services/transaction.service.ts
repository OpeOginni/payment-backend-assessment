import { eq, AnyColumn, sql } from 'drizzle-orm';

import { db } from "../db/db";
import { Transaction, cardTokens, cards, transactions, wallets } from "../db/schema";
import CustomError from '../lib/customError';
import { CreatePaymentDto, QueryTransactionDto, UpdateTransactionDto, insertTransactonSchema } from '../types/transaction.types';
import { compareSecret, hashSecret } from '../lib/auth';
import { ErrorTitleEnum, TransactionStatusEnum, TransactionTypeEnum } from '../types/enums';

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

    if (!cardToken) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Invalid Token", 401, { amount: dto.amount })

    const card = await db.query.cards.findFirst({
        where: eq(cards.id, cardToken.cardId),
        with: {
            wallet: true
        }
    })

    if (!card) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Card doesnt Exist", 401, { amount: dto.amount })


    if (card.wallet.balance < dto.amount) {

        const transactionStatus = TransactionStatusEnum.FAILED

        const finalDto = insertTransactonSchema.parse({
            cardId: cardToken.cardId,
            amount: dto.amount,
            walletId: cardToken.card.walletId,
            transactionStatus: transactionStatus,
            transactionType: TransactionTypeEnum.WITHDRAWAL
        })

        const transaction = await db.insert(transactions).values(finalDto).returning()

        throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Insufficient Funds", 400, { transactionId: transaction[0]?.id, amount: transaction[0]?.amount, status: transaction[0]?.transactionStatus })
    }

    const transactionStatus = TransactionStatusEnum.PENDING

    const finalDto = insertTransactonSchema.parse({
        cardId: cardToken.cardId,
        amount: dto.amount,
        walletId: cardToken.card.walletId,
        transactionStatus: transactionStatus,
        transactionType: TransactionTypeEnum.WITHDRAWAL
    })

    const transaction = await db.insert(transactions).values(finalDto).returning()

    await db.update(wallets)
        .set({
            balance: decrement(wallets.balance, dto.amount)
        })

    return transaction[0]
}

export async function getTransactionService(dto: QueryTransactionDto): Promise<Transaction | undefined> {

    const transaction = await db.query.transactions.findFirst({
        where: eq(transactions.id, dto.id)
    })

    if (!transaction) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Transaction Doesnt Exist", 404)

    return transaction
}

export async function updateTransactionService(dto: UpdateTransactionDto): Promise<Transaction | undefined> {

    const transaction = await db.query.transactions.findFirst({
        where: eq(transactions.id, dto.transactionId)
    })

    if (!transaction) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Transaction Doesnt Exist", 404)

    const updatedTransaction = await db.update(transactions).set({
        transactionStatus: dto.transactionStatus
    }).where(
        eq(transactions.id, dto.transactionId)
    ).returning()

    if (!updatedTransaction[0]) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Transaction Could not be Updated", 404)

    return updatedTransaction[0]
}

export async function deleteTransactionService(dto: QueryTransactionDto) {

    const transaction = await db.query.transactions.findFirst({
        where: eq(transactions.id, dto.id)
    })

    if (!transaction) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Transaction Doesnt Exist", 404)

    await db.delete(transactions).where(
        eq(transactions.id, dto.id)
    )

}