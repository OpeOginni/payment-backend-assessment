import { Router } from "express";
import { getHealthCheck } from "../controllers/health-check.controller";
import { createCard, createUser, createWallet } from "../controllers/user.controller";
import { deleteTransaction, getTransaction, updateTransaction } from "../controllers/transaction.controller";


const transactionRouter = Router()

transactionRouter.get("/:id", getTransaction)

transactionRouter.patch("/", updateTransaction)

transactionRouter.delete("/:id", deleteTransaction)

export default transactionRouter