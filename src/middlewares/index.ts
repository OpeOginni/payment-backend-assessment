import { Request, Response, NextFunction } from 'express';
import { db } from "../db/db";

import { rateLimit } from 'express-rate-limit'
import { eq, } from 'drizzle-orm';
import { cardTokens, cards, insertCardTokensSchema, } from "../db/schema";
import { compareSecret, generateToken, hashSecret } from '../lib/auth';
import CustomError from '../lib/customError';
import { createCardTokenSchema, createPaymentSchema } from '../types/transaction.types';
import errorHandler from '../lib/errorHandler';


export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 5, // 5 requests per minute
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: "Too many Calls, please ty again later",
    // store: ... , // Redis, Memcached, etc. 
})

export async function cardVerification(req: Request, res: Response, next: NextFunction) {
    try {
        // Cannot Hash CardNumber because we need to query it when making payment
        const dto = createCardTokenSchema.parse(req.body)

        const card = await db.query.cards.findFirst({
            where: eq(cards.cardNumber, dto.cardNumber),
            with: {
                wallet: true
            }
        })

        if (!card) throw new CustomError("Card Doesnt Exist", 401)

        if (!await compareSecret(dto.ccv, card.ccv)) throw new CustomError("Incorrect Card Details", 401)

        if (card.expiryMonth != dto.expiryMonth) throw new CustomError("Incorrect Card Details", 401)

        if (card.expiryYear != dto.expiryYear) throw new CustomError("Incorrect Card Details", 401)

        if (card.expiryYear < new Date().getFullYear()) throw new CustomError("Card Is Expired", 401)

        if (card.expiryYear == new Date().getFullYear() && card.expiryMonth <= (new Date().getMonth() + 1)) throw new CustomError("Card Is Expired", 401)

        res.locals.cardId = card.id

        next()
    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}

export async function tokenizeCardDetails(req: Request, res: Response, next: NextFunction) {
    try {
        // Cannot Hash CardNumber because we need to query it when making payment
        const paymentDetails = createCardTokenSchema.parse(req.body)

        const token = generateToken(`${paymentDetails.cardNumber}-${paymentDetails.expiryMonth}-${paymentDetails.expiryYear}-${paymentDetails.ccv}`)

        const dto = insertCardTokensSchema.parse({
            cardId: res.locals.cardId,
            token: token
        })

        const cardToken = await db.insert(cardTokens).values(dto).returning()

        if (!cardToken[0]) throw new CustomError("Error in Transaction", 500)

        req.body = { token: cardToken[0].token, amount: paymentDetails.amount }

        next()
    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}