import { Request, Response, NextFunction } from 'express';
import { db } from "../db/db";

import { rateLimit } from 'express-rate-limit'
import { eq, } from 'drizzle-orm';
import { cardTokens, cards} from "../db/schema";
import {insertCardTokensSchema} from "../db/types"
import { compareSecret, generateToken } from '../lib/auth';
import CustomError from '../lib/customError';
import { createCardTokenSchema } from '../types/transaction.types';
import errorHandler from '../lib/errorHandler';
import { ErrorTitleEnum } from '../types/enums';


// Rate Limiter middlewate using the express-rate-limit package
export const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    limit: 20, // 5 requests per minute
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

        // if card doesnt exist throw error
        if (!card) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Card Doesnt Exist", 404, { amount: dto.amount })

        // Compare the ccv with the hashed ccv in the db
        if (!await compareSecret(dto.ccv, card.ccv)) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Incorrect Card Details", 400, { amount: dto.amount, cardId: card.id })

        // Card Expiry Dates Verification
        if (card.expiryMonth != dto.expiryMonth) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Incorrect Card Details", 400, { amount: dto.amount, cardId: card.id })
        if (card.expiryYear != dto.expiryYear) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Incorrect Card Details", 400, { amount: dto.amount, cardId: card.id })

        // Card Expiration Check
        if (card.expiryYear < new Date().getFullYear()) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Card Is Expired", 400, { amount: dto.amount, cardId: card.id })
        if (card.expiryYear == new Date().getFullYear() && card.expiryMonth <= (new Date().getMonth() + 1)) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Card Is Expired", 401, { amount: dto.amount, cardId: card.id })

        // saving the cardId in the res.locals to be used in the next middleware
        res.locals.cardId = card.id

        next()
    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}

export async function tokenizeCardDetails(req: Request, res: Response, next: NextFunction) {

    // This middleware creates a token to represent a card and passes it on in the req.body
    try {
        // Cannot Hash CardNumber because we need to query it when making payment
        const paymentDetails = createCardTokenSchema.parse(req.body)


        const token = generateToken(`${paymentDetails.cardNumber}-${paymentDetails.expiryMonth}-${paymentDetails.expiryYear}-${paymentDetails.ccv}`)

        const dto = insertCardTokensSchema.parse({
            cardId: res.locals.cardId,
            token: token
        })

        const cardToken = await db.insert(cardTokens).values(dto).returning()

        if (!cardToken[0]) throw new CustomError(ErrorTitleEnum.TRANSACTION_ERROR, "Error in Transaction", 500, { token: dto.token, cardId: dto.cardId })

        req.body = { token: cardToken[0].token, amount: paymentDetails.amount }

        next()
    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}