import { ErrorTitleEnum } from "../types/enums";

export default class CustomError extends Error {
    constructor(public title: ErrorTitleEnum, public message: string, public code: number, public details?: any) {
        super(message);
        // This line is necessary to restore the correct prototype chain
        Object.setPrototypeOf(this, new.target.prototype);
    }
}