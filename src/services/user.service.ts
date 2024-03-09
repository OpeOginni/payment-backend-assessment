import { eq, } from 'drizzle-orm';

import { users, cards, wallets, } from "../db/schema";
import { NewUser, User, Card, NewCard, Wallet } from "../db/types"
import { db } from "../db/db";
import { CreateWalletDto, GetUserCardsDto } from "../types/user.types";
import { hashSecret } from "../lib/auth";
import CustomError from '../lib/customError';
import { ErrorTitleEnum } from '../types/enums';

export async function createUserService(dto: NewUser): Promise<User[]> {

    dto.password = await hashSecret(dto.password)

    const newUser = await db.insert(users).values(dto).returning()

    return newUser
}

export async function createWalletService(dto: CreateWalletDto): Promise<Wallet[]> {

    const user = await db.query.users.findFirst({
        where: eq(users.id, dto.id)
    })

    if (!user) throw new CustomError(ErrorTitleEnum.WALLET_ERROR, "UserID Doesnt Exsit", 401)

    const newWallet = await db.insert(wallets).values(dto).returning()

    return newWallet
}

export async function createCardService(dto: NewCard): Promise<Card[]> {

    const user = await db.query.users.findFirst({
        where: eq(users.id, dto.ownerId)
    })

    if (!user) throw new CustomError(ErrorTitleEnum.CARD_ERROR, "UserID Doesnt Exist", 401)

    dto.ccv = await hashSecret(dto.ccv)

    const card = await db.insert(cards).values(dto).returning()

    return card
}

export async function getUserCardsService(dto: GetUserCardsDto): Promise<Card[]> {

    const user = await db.query.users.findFirst({
        where: eq(users.id, dto.id),
        with: {
            cards: true
        }
    })

    if (!user) throw new CustomError(ErrorTitleEnum.CARD_ERROR, "UserID Doesnt Exist", 401)

    return user.cards
}

export async function getUserWalletService(dto: GetUserCardsDto): Promise<Wallet | null> {

    const user = await db.query.users.findFirst({
        where: eq(users.id, dto.id),
        with: {
            wallet: true
        }
    })

    if (!user) throw new CustomError(ErrorTitleEnum.CARD_ERROR, "UserID Doesnt Exist", 401)

    return user.wallet
}