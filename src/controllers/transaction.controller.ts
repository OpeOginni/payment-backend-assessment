import { Request, Response } from "express";


import errorHandler from "../lib/errorHandler";
import { createPaymentSchema, insertTransactonSchema, queryTransactionSchema, updateTransactionSchema } from "../types/transaction.types";
import { TransactionTypeEnum } from "../types/enums";
import { deleteTransactionService, getTransactionService, paymentTransactionService, updateTransactionService } from "../services/transaction.service";




export async function paymentTransaction(req: Request, res: Response) {
    try {
        // validation
        const dto = createPaymentSchema.parse(req.body)

        const transaction = await paymentTransactionService(dto)

        return res.status(200).json({ success: true, transaction })
    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}

export async function getTransaction(req: Request, res: Response) {
    try {
        // validation
        const dto = queryTransactionSchema.parse(req.params)


        const transaction = await getTransactionService(dto)

        return res.status(200).json({ success: true, transaction })
    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}

export async function updateTransaction(req: Request, res: Response) {
    try {
        // validation
        const dto = updateTransactionSchema.parse(req.body)


        const updatedTransaction = await updateTransactionService(dto)

        return res.status(200).json({ success: true, updatedTransaction })
    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}

export async function deleteTransaction(req: Request, res: Response) {
    try {
        // validation
        const dto = queryTransactionSchema.parse(req.params)

        await deleteTransactionService(dto)

        return res.status(200).json({ success: true, message: "Deleted Transaction" })
    } catch (err: any) {
        return errorHandler(err, req, res)
    }
}
