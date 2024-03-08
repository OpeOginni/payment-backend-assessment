import { Router } from "express";
import { getHealthCheck } from "../controllers/health-check.controller";
import { createCard, createUser, createWallet, getUserCards, getUserWallet } from "../controllers/user.controller";

// Router holding all routes for users
const userRouter = Router()

userRouter.post("/", createUser)

userRouter.post("/:id/wallet", createWallet)

userRouter.post("/:id/card", createCard)

userRouter.get("/:id/card", getUserCards)

userRouter.get("/:id/wallet", getUserWallet)

export default userRouter