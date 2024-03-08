import { Request, Response, NextFunction } from 'express';
import postgres from 'postgres';
import { ZodError } from 'zod';
import CustomError from './customError';
import { ErrorTitleEnum } from '../types/enums';
import { failedTransactionLogger } from './logger';

// This is a custom error handler function to handle all errors in the app
export default function errorHandler(err: Error, req: Request, res: Response, next?: NextFunction) {
    if (err instanceof ZodError) {
        // Handles all Zod Validation Error
        const errors = err.errors.map(error => ({
            param: error.path[0],
            message: error.message
        }));
        return res.status(400).json({ error: "Validation Error", errors });
    }

    if (err instanceof postgres.PostgresError) {
        // Handles all Postgres Errors

        if (err.code === '23505') return res.status(409).json({ error: "Duplicate Error", message: err.message, detail: err.detail })

        return res.status(500).json({ error: "DB Error", message: err.message });
    }

    if (err instanceof CustomError) {
        // Handles all our Custom Errors
        if (err.title === ErrorTitleEnum.TRANSACTION_ERROR) {

            // This gets all extra details of a failed transaction to be logged too IF they exist
            let detailsLog = '';
            if (err.details) {
                for (const [key, value] of Object.entries(err.details)) {
                    detailsLog += `${key.toLocaleUpperCase()}: ${value}, `;
                }
            }

            failedTransactionLogger.error(`Payment failed - ${detailsLog}Error: ${err.message}`)
        }

        return res.status(err.code).json({ error: err.title, message: err.message, });
    }
    res.status(500).json({ message: "Internal server error", detail: err.message });
}