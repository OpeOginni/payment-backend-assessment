import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import healthCheckRouter from "./routes/health-check.route";
import userRouter from "./routes/user.route";
import transactionRouter from "./routes/transaction.route";
import { paymentTransaction } from "./controllers/transaction.controller";
import { cardVerification, limiter, tokenizeCardDetails } from "./middlewares";


const app: Express = express();

app.use(bodyParser.json())


app.get("/", (req: Request, res: Response) => {
    res.send({ server: "Express + TypeScript Server", author: "Opeyemi Oginni" });
});

// ROUTES
app.use("/api/health-check", healthCheckRouter)
app.use("/api/user", userRouter)
app.use("/api/transaction", transactionRouter)

// The payment route with the middlewares for;
// 1. Rate Limiting
// 2. Card Verification to check if the card is valid and if the details passed (ccv, expirt date) are correct to that card
// 3. Tokenize the card details to get a token that will be used to make the payment
app.post("/api/payment", limiter, cardVerification, tokenizeCardDetails, paymentTransaction)


export default app