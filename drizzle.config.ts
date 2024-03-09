import 'dotenv/config';
import { defineConfig } from 'drizzle-kit'

// This is just a config for drizzle-kit to help with migrations
export default defineConfig({
    schema: "./src/db/schema.ts",
    out: './drizzle',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DB_URL as string,
    },
    verbose: true,
    strict: true,
})