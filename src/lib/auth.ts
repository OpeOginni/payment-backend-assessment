import dotenv from 'dotenv';
dotenv.config();

import * as argon from 'argon2'
import crypto from 'crypto';



export const hashSecret = (secret: string) => {
    return argon.hash(secret)
}

export const compareSecret = (passedSecret: string, hashedSecret: string) => {
    return argon.verify(hashedSecret, passedSecret)
}

export const generateToken = (cardDetails: string): string => {
    const token = crypto.randomBytes(16).toString('hex');
    return token;
};