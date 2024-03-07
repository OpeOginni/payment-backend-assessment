import { Router } from "express";
import { getHealthCheck } from "../controllers/health-check.controller";


const healthCheckRouter = Router()

healthCheckRouter.get("/", getHealthCheck)

export default healthCheckRouter