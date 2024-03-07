import { z } from 'zod';

export const getUserCardsSchema = z
    .object({
        id: z.string().uuid(),
    })

export type CreateWalletDto = z.infer<typeof getUserCardsSchema>;

export type GetUserCardsDto = {
    id: string;
}

export type CreateCardDto = {
    ownerId: string;
}