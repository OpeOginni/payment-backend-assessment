import request from 'supertest';
import { describe, expect, test } from '@jest/globals';

import app from '../../../app';
import { db, queryClient } from '../../../db/db';
import { cardTokens, cards, transactions, users, wallets } from '../../../db/schema';
import { User, Wallet, Card } from "../../../db/types"
import { ErrorTitleEnum } from '../../../types/enums';

// I  made use of an actual postgres DB for testing because thats the best way to run tests when using DrizzleORM
// Mianly capability for Mock Databse Testing isnt really available as for Prisma

// So my solution is to create a temporary test DB using Docker to just run the tests and then delete the DB after the tests are done.
// This aproach even helps to make sure that the integration will work when moving to an actual DB

describe('POST /api/payment', () => {

    let user: User;
    let wallet: Wallet;
    let card: Card;
    let cardCCV: string

    // This is Run before all Payment Tests to SEED the DB with a user, wallet and card to use
    beforeAll(async () => {
        // Sign up a user
        const userResponse = await request(app).post('/api/user').send({
            email: "ope@gmail.com",
            password: "wisdomMAIN",
            phoneNumber: "+23480374444"
        });

        user = userResponse.body.user[0] as User

        // Create a wallet
        const walletResponse = await request(app).post(`/api/user/${user.id}/wallet`).send();

        wallet = walletResponse.body.wallet[0] as Wallet

        // Create a card
        const cardResponse = await request(app).post(`/api/user/${user.id}/card`).send();

        card = cardResponse.body.card[0] as Card
        cardCCV = cardResponse.body.cardCCV as string

        console.log("SEEDED DB")
    });


    // Validation Tests
    describe("when all required data is passed correctly", () => {

        test("should respnd with a 200 status code", async () => {
            const response = await request(app).post("/api/payment").send({
                cardNumber: card.cardNumber,
                amount: 5,
                ccv: cardCCV,
                expiryMonth: card.expiryMonth,
                expiryYear: card.expiryYear
            })
            expect(response.statusCode).toBe(200)
        })

        test("wallet balance should be 5", async () => {
            const response = await request(app).get(`/api/user/${user.id}/wallet`)

            const wallet: Wallet = response.body.wallet as Wallet

            expect(wallet.balance).toBe(5)
        })

    })

    describe("when the passed body is wrong", () => {
        test("should respond with a 400 status code and send Validation Error", async () => {

            const bodyData = [
                // Missing Card Number
                {
                    amount: 5,
                    ccv: cardCCV,
                    expiryMonth: card.expiryMonth,
                    expiryYear: card.expiryYear
                },
                // CCV with Less than 3 characters
                {
                    cardNumber: card.cardNumber,
                    amount: 5,
                    ccv: "23",
                    expiryYear: card.expiryYear
                },
                // when the passed amount is 0
                {
                    cardNumber: card.cardNumber,
                    amount: 0,
                    ccv: cardCCV,
                    expiryMonth: card.expiryMonth,
                    expiryYear: card.expiryYear
                },
                // when the passed amount is less than 0
                {
                    cardNumber: card.cardNumber,
                    amount: -1,
                    ccv: cardCCV,
                    expiryMonth: card.expiryMonth,
                    expiryYear: card.expiryYear
                },

                // when the passed card number is less than 16 characters
                {
                    cardNumber: "234543213565",
                    amount: -1,
                    ccv: cardCCV,
                    expiryMonth: card.expiryMonth,
                    expiryYear: card.expiryYear
                },
            ]

            for (const body of bodyData) {
                const response = await request(app).post("/api/payment").send(body)
                expect(response.statusCode).toBe(400)
                expect(response.body.error).toBe("Validation Error")
            }
        })

    })

    describe("when the passed card number doesnt exist", () => {

        test("should respond with a 404 status code, send Transaction Error and error message of Card Doesnt Exist", async () => {
            const response = await request(app).post("/api/payment").send({
                cardNumber: "1234567890123456",
                amount: 5,
                ccv: cardCCV,
                expiryMonth: card.expiryMonth,
                expiryYear: card.expiryYear
            })

            expect(response.statusCode).toBe(404)
            expect(response.body.error).toBe(ErrorTitleEnum.TRANSACTION_ERROR)
            expect(response.body.message).toBe("Card Doesnt Exist")
        })

    })

    // Authentication Tests
    describe("when the passed card details are wrong", () => {

        test("should respond with a 401 status code and send Transaction Error", async () => {

            const bodyData = [
                // when the passed ccv is incorrect for the card
                {
                    cardNumber: card.cardNumber,
                    amount: 5,
                    ccv: "000",
                    expiryMonth: card.expiryMonth,
                    expiryYear: card.expiryYear
                },
                // when the passed expiry month is incorrect for the card
                {
                    cardNumber: card.cardNumber,
                    amount: 5,
                    ccv: cardCCV,
                    expiryMonth: card.expiryMonth + 1,
                    expiryYear: card.expiryYear
                },
                // when the passed expiry year is incorrect for the card
                {
                    cardNumber: card.cardNumber,
                    amount: 5,
                    ccv: cardCCV,
                    expiryMonth: card.expiryMonth,
                    expiryYear: card.expiryYear + 1
                }
            ]

            for (const body of bodyData) {
                const response = await request(app).post("/api/payment").send(body)
                expect(response.statusCode).toBe(400)
                expect(response.body.error).toBe(ErrorTitleEnum.TRANSACTION_ERROR)
            }
        })

    })

    describe("when the wallet balance is insufficient", () => {

        test("should respond with a 401 status code, send Transaction Error and error message of Insufficient Funds", async () => {

            const response = await request(app).post("/api/payment").send({
                cardNumber: card.cardNumber,
                amount: 100000,
                ccv: cardCCV,
                expiryMonth: card.expiryMonth,
                expiryYear: card.expiryYear
            })

            expect(response.statusCode).toBe(400)
            expect(response.body.error).toBe(ErrorTitleEnum.TRANSACTION_ERROR)
            expect(response.body.message).toBe("Insufficient Funds")
        })

    })

    // Rate Limit Test
    describe("when endpoint is called more than 20 times", () => {

        test("should respond with a 429 status code and send Too Many Calls", async () => {
            for (let i = 0; i < 21; i++) {
                const response = await request(app).post("/api/payment").send({
                    cardNumber: card.cardNumber,
                    amount: 5,
                    ccv: "23",
                    expiryMonth: card.expiryMonth,
                    expiryYear: card.expiryYear
                })
            }

            const response = await request(app).post("/api/payment").send({
                cardNumber: card.cardNumber,
                amount: 5,
                ccv: cardCCV,
                expiryMonth: card.expiryMonth,
                expiryYear: card.expiryYear
            })

            expect(response.statusCode).toBe(429)
            console.log(response.body)
        })

    })

    afterAll(async () => {
        // Clear the DB after the tests
        await db.delete(users)
        await db.delete(wallets)
        await db.delete(cards)
        await db.delete(transactions)
        await db.delete(cardTokens)

        await queryClient.end() // Close Connection to DB
        console.log("CLEARED DB")
    });
});

// I couldn't integrate the Unit Testing of the PaymentService because of its dependence on the tokenizeCardDetails middleware.

// But the Integration Test Handles it Properly.