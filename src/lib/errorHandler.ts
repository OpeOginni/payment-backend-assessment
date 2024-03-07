import { Request, Response, NextFunction } from 'express';
import postgres from 'postgres';
import { ZodError } from 'zod';
import CustomError from './customError';

export default function errorHandler(err: Error, req: Request, res: Response, next?: NextFunction) {
    if (err instanceof ZodError) {
        const errors = err.errors.map(error => ({
            param: error.path[0],
            message: error.message
        }));
        return res.status(400).json({ error: "Validation Error", errors });
    }

    if (err instanceof postgres.PostgresError) {

        if (err.code === '23505') return res.status(409).json({ error: "Duplicate Error", message: err.message, detail: err.detail })

        return res.status(500).json({ error: "DB Error", message: err.message });
    }

    if (err instanceof CustomError) {


        return res.status(err.code).json({ error: "Custom Error", message: err.message });
    }
    res.status(500).json({ message: "Internal server error" });
}