import dotenv from 'dotenv';
dotenv.config();

import * as argon from 'argon2'
import crypto from 'crypto';

// This function will hash the secret using argon2
export const hashSecret = (secret: string) => {
    return argon.hash(secret)
}

// This function will compare the secret with the hashed secret
export const compareSecret = (passedSecret: string, hashedSecret: string) => {
    return argon.verify(hashedSecret, passedSecret)
}

// This function will generate a random token using passed in card Details
export const generateToken = (cardDetails: string): string => {
    const token = crypto.randomBytes(16).toString('hex');
    return token;
};