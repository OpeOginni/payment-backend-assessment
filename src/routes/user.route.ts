import { Router } from "express";
import { getHealthCheck } from "../controllers/health-check.controller";
import { createCard, createUser, createWallet, getUserCards } from "../controllers/user.controller";


const userRouter = Router()

userRouter.post("/", createUser)

userRouter.post("/:id/wallet", createWallet)

userRouter.post("/:id/card", createCard)

userRouter.get("/:id/card", getUserCards)

export default userRouter