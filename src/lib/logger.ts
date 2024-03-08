import winston from 'winston';

// Define log levels and colors
const logLevels = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3
    },
    colors: {
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue'
    }
};

// Logger for sent payment transactions
export const sentTransactionLogger = winston.createLogger({
    level: 'info',
    levels: logLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'payment-success.log' }), // Log successful transactions to a file
    ]
});

// Logger for successful payment transactions
export const successfulTransactionLogger = winston.createLogger({
    level: 'info',
    levels: logLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'payment-success.log' }), // Log successful transactions to a file
    ]
});

// Logger for failed payment transactions
export const failedTransactionLogger = winston.createLogger({
    level: 'error',
    levels: logLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: 'payment-error.log' }), // Log failed transactions to a file
    ]
});