import { Request, Response } from "express";

import { createCardService, createUserService, createWalletService, getUserCardsService, getUserWalletService } from "../services/user.service";
import { insertCardsSchema, insertUserSchema, insertWalletSchema } from "../db/types";
import { generateCCV, generateCardNumber, generateExpiryMonth, generateExpiryYear } from "../lib/utils";
import errorHandler from "../lib/errorHandler";
import { getUserCardsSchema, getUserWalletSchema } from "../types/user.types";


export async function createUser(req: Request, res: Response) {
    try {
        // validation

        const dto = insertUserSchema.parse(req.body)

        const user = await createUserService(dto)
        return res.status(200).json({ success: true, user })
    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}

export async function createWallet(req: Request, res: Response) {
    try {
        // validation

        const dto = insertWalletSchema.parse(req.params)

        const wallet = await createWalletService(dto)
        return res.status(200).json({ success: true, wallet })
    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}

export async function createCard(req: Request, res: Response) {
    try {

        const ownerId = req.params.id
        const walletId = req.params.id

        // generating random card details
        const cardNumber = generateCardNumber()
        const ccv = generateCCV()
        const expiryMonth = generateExpiryMonth()
        const expiryYear = generateExpiryYear()

        console.log(`CCV: ${ccv}`)

        // validation
        const dto = insertCardsSchema.parse({
            ownerId,
            cardNumber,
            ccv,
            expiryMonth,
            expiryYear,
            walletId
        })

        const card = await createCardService(dto)
        // return res.status(200).json({ success: true, card })

        return res.status(200).json({ success: true, card, cardCCV: ccv }) // This is to let the test know what the ccv is for tests

    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}

export async function getUserCards(req: Request, res: Response) {
    try {

        const dto = getUserCardsSchema.parse(req.params)

        const cards = await getUserCardsService(dto)

        return res.status(200).json({ success: true, userId: dto.id, cards })

    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}

export async function getUserWallet(req: Request, res: Response) {
    try {

        const dto = getUserWalletSchema.parse(req.params)

        const wallet = await getUserWalletService(dto)

        return res.status(200).json({ success: true, userId: dto.id, wallet })

    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}