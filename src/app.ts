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

app.post("/api/payment", limiter, cardVerification, tokenizeCardDetails, paymentTransaction)


export default app