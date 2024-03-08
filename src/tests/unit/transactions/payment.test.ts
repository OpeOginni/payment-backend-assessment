import request, { Response } from 'supertest';
import { describe, expect, test } from '@jest/globals';

import jest from 'jest'
import app from '../../../app'; // Import your Express app
import { db } from '../../../db/db'; // Import your database instance
import { paymentTransactionService } from '../../../services/transaction.service'; // Import your payment service
import { Card, User, Wallet } from '../../../db/schema';


const createUser =
describe('POST /api/payment', () => {

    let user: User;
    let wallet: Wallet;
    let card: Card;
    let cardCCV: string

    beforeEach(async () => {
        // Sign up a user
        const userResponse = await request(app).post('/api/user').send({
            email: "ope@gmail.com",
            password: "wisdomMAIN",
            phoneNumber: "+23480374444"
        });

        console.log(userResponse.body)

        user = userResponse.body.user as User

        // Create a wallet
        const walletResponse = await request(app).post(`/api/user/${user.id}/wallet`).send();

        wallet = walletResponse.body.wallet as Wallet

        // Create a card
        const cardResponse = await request(app).post(`/api/user/${user.id}/card`).send();

        card = cardResponse.body.card as Card
        cardCCV = cardResponse.body.cardCCV as string
    });


    // Validation Tests
    describe("when all required data is passed correctly", () => {

        test("should respnd with a 200 status code", async () => {
            const response = await request(app).post("/api/payment").send({
                cardNumber: card.cardNumber,
                amount: 40,
                ccv: cardCCV,
                expiryMonth: card.expiryMonth,
                expiryYear: card.expiryYear
            })
            expect(response.statusCode).toBe(200)
        })

    })

    describe("when the passed amount is 0", () => {

    })

    describe("when the passed amount is less than 0", () => {

    })

    describe("when the passed card number is less than 16 characters", () => {

    })

    describe("when the passed card number doesnt exist", () => {

    })

    describe("when the passed ccv is less than 3 characters", () => {

    })

    describe("when the passed ccv is incorrect for the card", () => {

    })

    describe("when the passed expiry month is incorrect for the card", () => {

    })

    describe("when the passed expiry year is incorrect for the card", () => {

    })

    // Error Tests

    describe("when the wallet balance is sufficient", () => {

    })

    describe("when the wallet balance is insufficient", () => {

    })

    // Extra Tests

    describe("make sure ccv is hashed", () => {

    })
});