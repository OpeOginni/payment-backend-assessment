// util function to generate a random 16 digit card number
export const generateCardNumber = (): string => {
    let cardNumber = "";
    for (let i = 0; i < 16; i++) {
        cardNumber += Math.floor(Math.random() * 10);
    }
    return cardNumber;
}

// util function to generate a random 3 digit ccv number
export const generateCCV = (): string => {
    let ccv = "";
    for (let i = 0; i < 3; i++) {
        ccv += Math.floor(Math.random() * 10);
    }
    return ccv;
}

export const generateExpiryMonth = (): number => {
    let month = Math.floor(Math.random() * 12) + 1; // generates a number between 1 and 12
    return month; // returns the month as a number
}

export const generateExpiryYear = (): number => {
    let year = Math.floor(Math.random() * 20) + 2025; // generates a number between 2025 and 2044
    return year;
}